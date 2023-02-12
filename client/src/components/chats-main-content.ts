import Controller from '../lib/controller';
import socket, { emitPersonalMessage } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { Chat } from '../types/entities';
import ChatsMainContentView, { RenderedPersonalMessage } from '../views/chats-main-content-view';
import ChatsScreen from './chats-screen';
import MessageFastMenu from './message-fast-menu';

class ChatsMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
    this.fastMenusMap = new Map();
  }

  chat: Chat | null;
  fastMenusMap: Map<HTMLElement, MessageFastMenu>;
  // menusMap: Map<HTMLElement, MessageFastMenu>;

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }

    this.view.render();

    if (this.chat) {
      await this.fetchMessages();
      this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
      this.view.bindMessageEvent(this.handleSendMessage);
      appStore.bindPersonalMessageListChanged(this.onMessageListChange);
      this.onSocketPersonalMessage();
      this.view.bindMessageHover(this.showFastMenu);
      this.view.bindMessageLeave(this.destroyFastMenu);
    }
  }

  private async fetchMessages(): Promise<void> {
    if (!appStore.user || !this.chat) {
      return;
    }
    await appStore.fetchPersonalMessages(appStore.user.id, this.chat.userId);
  }

  onMessageListChange = async (messages: RenderedPersonalMessage[]): Promise<void> => {
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
    socket.removeAllListeners('personalMessage');
    socket.on('personalMessage', async ({ fromUserId, toUserId }) => {
      if (!this.chat) {
        return;
      }
      await this.fetchMessages();
      await this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
    });
  }

  showFastMenu = async ($root: HTMLElement): Promise<void> => {
    const fastMenu = new MessageFastMenu($root);
    await fastMenu.init();
    this.fastMenusMap.set($root, fastMenu);
  };

  destroyFastMenu = ($root: HTMLElement) => {
    const fastMenu = this.fastMenusMap.get($root);
    if (fastMenu) {
      fastMenu.destroy();
    }
  };
}

export default ChatsMainContentComponent;
