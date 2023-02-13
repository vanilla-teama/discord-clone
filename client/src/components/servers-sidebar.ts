import App from '../lib/app';
import Controller from '../lib/controller';
import { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Channel, Chat, User } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import { PopupCoords } from '../views/popup-view';
import ServersSideBarView from '../views/servers-sidebar-view';
import ChatsCreateFormComponent from './chats-create-form';
import PopupComponent from './popup';

class ServersSideBarComponent extends Controller<ServersSideBarView> {
  // Keeps last instance of itself
  static instance: ServersSideBarComponent;

  constructor() {
    super(new ServersSideBarView());
    ServersSideBarComponent.instance = this;
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    this.view.render();
    this.view.bindShowCreateChat(this.onShowCreateChat);
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.channels);
    this.bindRouteChanged();
    // ChatsScreen.bindChatUpdate('sidebar', this.onChatUpdate);
    this.bindSocketUserAvailabilityChangedServer();
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (channels: Channel[]): void => {
    this.view.displayChannels(channels);
  };

  onChatUpdate = (chat: Chat): void => {
    //this.view.updateChat(chat);
    this.toggleActiveStatus();
  };

  onShowCreateChat = (coords: PopupCoords) => {
    new PopupComponent(coords, ChatsCreateFormComponent).init();
  };

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    this.view.toggleActiveStatus(params[0]);
  }

  bindRouteChanged() {
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, (event) => {
      const {
        detail: { controller, params },
      } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

      if (controller === RouteControllers.Servers && params.length > 0) {
        this.view.toggleActiveStatus(params[0]);
      }
    });
  }

  bindSocketUserAvailabilityChangedServer() {
    socket.removeListener('userChangedAvailability', ServersSideBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ServersSideBarComponent.onSocketUserAvailabilityChangedServer);
  }

  static onSocketUserAvailabilityChangedServer = async ({
    availability,
    userId,
  }: {
    availability: Availability;
    userId: string;
  }): Promise<void> => {
    appStore.updateChatLocally(userId, { availability: availability });
  };
}

export default ServersSideBarComponent;
