import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import ChatsAppBarView from '../views/chats-app-bar-view';
import InfoBarView from '../views/info-bar-view';
import MainContentView from '../views/main-content-view';
import MainView from '../views/main-view';
import ChatsScreen from './chats-screen';
import MainComponent from './main';

class ChatsAppBarComponent extends Controller<ChatsAppBarView> {
  chat: Chat | null;

  constructor() {
    super(new ChatsAppBarView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  async init(): Promise<void> {
    this.view.render();
    this.bindSocketUserAvailabilityChangedServer();
    ChatsScreen.bindChatUpdate('appbar', this.onChatUpdate);
    this.view.bindShowInfoBarClick(this.toggleInfoBar);
    MainView.bindToggleInfoBar(this.view.setShowInfoBarButtonHideTooltip, this.view.setShowInfoBarButtonShowTooltip);
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

  toggleInfoBar = (): void => {
    MainView.toggleInfoBar();
  };
}

export default ChatsAppBarComponent;
