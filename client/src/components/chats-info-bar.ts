import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import ChatsInfoBarView from '../views/chats-info-bar-view';
import InfoBarView from '../views/info-bar-view';
import ChatsScreen from './chats-screen';

class ChatsInfoBarComponent extends Controller<ChatsInfoBarView> {
  chat: Chat | null;

  constructor() {
    super(new ChatsInfoBarView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  async init(): Promise<void> {
    this.view.render();
    this.bindSocketUserAvailabilityChangedServer();
    ChatsScreen.bindChatUpdate('infobar', this.onChatUpdate);
    if (this.chat) {
      this.view.displayStatus(this.chat.availability);
    }
  }

  bindSocketUserAvailabilityChangedServer() {
    socket.removeListener('userChangedAvailability', ChatsInfoBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsInfoBarComponent.onSocketUserAvailabilityChangedServer);
  }

  static onSocketUserAvailabilityChangedServer = ({
    availability,
    userId,
  }: {
    availability: Availability;
    userId: string;
  }): void => {
    appStore.updateChatLocally(userId, { availability: availability });
  };

  onChatUpdate = (chat: Chat): void => {
    this.view.displayStatus(chat.availability);
  };
}

export default ChatsInfoBarComponent;
