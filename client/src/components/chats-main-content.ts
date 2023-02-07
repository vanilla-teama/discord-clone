import App from '../lib/app';
import Controller from '../lib/controller';
import socket, { bindEvent as bindSocketEvent, emitPersonalMessage, removeSocketEvent } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { Chat } from '../types/entities';
import ChatsMainContentView, { RenderedPersonalMessage } from '../views/chats-main-content-view';
import ChatsScreen from './chats-screen';

class ChatsMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  chat: Chat | null;

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }

    this.view.render();

    if (this.chat) {
      this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
      this.view.bindMessageEvent(this.handleSendMessage);
      appStore.bindPersonalMessageListChanged(this.onMessageListChange);
      this.onSocketPersonalMessage();
    }
  }

  onMessageListChange = (messages: RenderedPersonalMessage[]) => {
    this.view.displayMessages(messages);
  };

  handleSendMessage = async (messageText: string): Promise<void> => {
    if (!appStore.user || !this.chat) {
      return;
    }
    const message: IncomingPersonalMessage = {
      fromUserId: appStore.user.id,
      toUserId: this.chat.userId,
      date: Date.now(),
      responseMessageId: null,
      message: messageText,
    };
    await appStore.addPersonalMessage(message);
    emitPersonalMessage(message);
  };

  onSocketPersonalMessage() {
    removeSocketEvent('personalMessageServer');
    bindSocketEvent('personalMessageServer', async ({ fromUserId, toUserId }) => {
      if (!this.chat) {
        return;
      }
      // await appStore.fetchPersonalMessages();
      this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
    });
  }
}

export default ChatsMainContentComponent;
