import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket, { bindEvent as bindSocketEvent, createSocketEvent, emitPersonalMessage } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { PersonalMessage } from '../types/entities';
import ChatsMainContentView, { RenderedPersonalMessage } from '../views/chats-main-content-view';

class ChatsMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView());
    if (!this.getOpponentId()) {
      Router.push(RouteControllers.Chats, '', ['63dd3d9da1340145e9b74055']);
    }
  }

  async init(): Promise<void> {
    this.view.render();

    const opponentId = this.getOpponentId();
    if (appStore.user && opponentId) {
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
    const opponentId = this.getOpponentId();
    if (!appStore.user || !opponentId) {
      return;
    }
    const message: IncomingPersonalMessage = {
      fromUserId: appStore.user.id,
      toUserId: opponentId,
      date: Date.now(),
      responseMessageId: null,
      message: messageText,
    };
    await appStore.addPersonalMessage(message);
    emitPersonalMessage(message);
  };

  onSocketPersonalMessage() {
    bindSocketEvent('personalMessageServer', (data) => {
      console.log(data);
      this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
    });
  }

  private getOpponentId(): string | null {
    const params = App.getRouter().getParams();
    return (params[0] as PersonalMessage['toUserId']) || null;
  }
}

export default ChatsMainContentComponent;
