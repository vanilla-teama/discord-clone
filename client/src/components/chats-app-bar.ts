import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsAppBarView from '../views/chats-app-bar-view';
import MainView from '../views/main-view';
import ChatsScreen from './chats-screen';

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
    this.bindShowInfoBarClick();
    this.bindAccountUpdated();
  }

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, ChatsAppBarComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (ChatsAppBarComponent.onAccountUpdated = (event) => {
        const {
          detail: { user },
        } = getTypedCustomEvent(CustomEvents.ACCOUNTUPDATED, event);
        if (!user) {
          return;
        }
        if (!this.chat || this.chat.userId !== user.id) {
          return;
        }
        const chat = appStore.chats.find((c) => c.userId === user.id);
        if (chat) {
          this.chat = chat;
          this.view.displayUsername(chat.userName);
        }
      })
    );
  }

  bindShowInfoBarClick = (): void => {
    MainView.bindToggleInfoBar(this.view.setShowInfoBarButtonHideTooltip, this.view.setShowInfoBarButtonShowTooltip);
    this.view.bindShowInfoBarClick(this.toggleInfoBar);
  };

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

  static onAccountUpdated: EventListener = () => {};
}

export default ChatsAppBarComponent;
