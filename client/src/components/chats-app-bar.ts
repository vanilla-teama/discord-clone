import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import ChatsAppBarView from '../views/chats-app-bar-view';
import ChatsScreen from './chats-screen';

class ChatsAppBarComponent extends Controller<ChatsAppBarView> {
  chat: Chat | null;

  constructor() {
    super(new ChatsAppBarView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  async init(): Promise<void> {
    this.view.render();
    // this.bindSocketUserAvailabilityChangedServer();
    // appStore.bindChatLocallyUpdate('appbar', this.onChatUpdate);
  }

  bindSocketUserAvailabilityChangedServer() {
    socket.removeListener('userChangedAvailability', ChatsAppBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsAppBarComponent.onSocketUserAvailabilityChangedServer);
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

export default ChatsAppBarComponent;
