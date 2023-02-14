import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Channel, Chat, User } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import { PopupCoords } from '../views/popup-view';
import ServersSideBarView from '../views/servers-sidebar-view';
import ChatsCreateFormComponent from './chats-create-form';
import MainComponent from './main';
import PopupComponent from './popup';

class ServersSideBarComponent extends Controller<ServersSideBarView> {
  // Keeps last instance of itself
  static instance: ServersSideBarComponent;

  static serverId: string | null;

  static channelId: string | null;

  constructor() {
    ServersSideBarComponent.serverId = null;
    ServersSideBarComponent.channelId = null;
    super(new ServersSideBarView());
    ServersSideBarComponent.instance = this;
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    this.view.render();
    appStore.bindChannelListChanged(this.onChannelListChanged);
    ServersSideBarComponent.bindRouteChanged();
    {
      const serverId = new Router().getParams()[0];
      if (serverId) {
        await ServersSideBarComponent.onUrlServerIdChanged(serverId);
      }
    }
    if (ServersSideBarComponent.channelId) {
      await ServersSideBarComponent.onUrlChannelIdChanged(ServersSideBarComponent.channelId);
    }
    this.view.bindShowCreateServer(this.onShowCreateChannel);
    this.onInit(appStore.user);
    this.bindSocketUserAvailabilityChangedServer();
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChannelListChanged = (channels: Channel[]): void => {
    this.view.displayChannels(channels);
  };

  onShowCreateChannel = (coords: PopupCoords) => {
    new PopupComponent(coords, ChatsCreateFormComponent).init();
  };

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    ServersSideBarView.toggleActiveStatus(params[0]);
  }

  static bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, ServersSideBarComponent.bindRouteChangedHandler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, ServersSideBarComponent.bindRouteChangedHandler);
  }

  static bindRouteChangedHandler = async (event: Event): Promise<void> => {
    const {
      detail: { controller, params },
    } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

    if (controller === RouteControllers.Servers) {
      if (params.length === 1) {
        await ServersSideBarComponent.onUrlServerIdChanged(params[0]);
      } else if (params.length >= 2) {
        await ServersSideBarComponent.onUrlChannelIdChanged(params[1]);
      }
    }
  };

  static async onUrlServerIdChanged(serverId: string): Promise<void> {
    appStore.resetChannels();
    await appStore.fetchChannels(serverId);
    ServersSideBarComponent.serverId = serverId;
    ServersSideBarComponent.channelId = null;
    if (appStore.channels[0]) {
      Router.push(RouteControllers.Servers, '', [ServersSideBarComponent.serverId, appStore.channels[0].id]);
      return;
    }
    // await new MainComponent().init();
  }

  static async onUrlChannelIdChanged(channelId: string): Promise<void> {
    if (!ServersSideBarComponent.serverId) {
      return;
    }
    if (ServersSideBarComponent.channelId === channelId) {
      return;
    }
    ServersSideBarComponent.channelId = channelId;
    ServersSideBarView.toggleActiveStatus(channelId);
    await new MainComponent().init();
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
