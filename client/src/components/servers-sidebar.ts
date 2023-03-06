import { channels as fakeChannels } from '../develop/data';
import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Channel, User } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ServersSideBarView from '../views/servers-sidebar-view';
import ChannelsCreateFormComponent from './channels-create-form';
import ChannelsInviteFormComponent from './channels-invite-form';
import MainComponent from './main';
import ModalComponent from './modal';
import ServersScreen from './servers-screen';

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
      const router = new Router();
      const serverId = router.getParams()[0];
      const channelId = router.getParams()[1];
      if (serverId && !channelId) {
        await ServersSideBarComponent.onUrlServerIdChanged(serverId);
      } else if (channelId) {
        await ServersSideBarComponent.onUrlChannelIdChanged(channelId);
      }
    }
    if (ServersSideBarComponent.channelId) {
      // await ServersSideBarComponent.onUrlChannelIdChanged(ServersSideBarComponent.channelId);
    }
    this.view.bindShowCreateChannel(this.onShowCreateChannel);
    this.view.bindOnInvite(this.onInvite);
    this.view.bindOnChannelItemClick(this.onChannelItemClick);
    this.onInit(appStore.user);
    this.bindSocketEvents();
  }

  displayCreateChannelContainer() {
    if (!appStore.user) {
      return;
    }
    const serverId = new Router().getParams()[0];
    const owner = appStore.getServerOwner(serverId);
    if (owner?.id === appStore.user.id) {
      this.view.displayCreateChannelContainer();
    }
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChannelListChanged = (channels: Channel[]): void => {
    this.view.displayChannels(channels);
  };

  onShowCreateChannel = async (): Promise<void> => {
    if (!ServersSideBarComponent.serverId) {
      return;
    }
    await new ModalComponent().init();
    await new ChannelsCreateFormComponent(ServersSideBarComponent.serverId).init();
  };

  onInvite = async (channel: Channel): Promise<void> => {
    await new ModalComponent().init();
    await new ChannelsInviteFormComponent(channel.id).init();
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
        if (ServersSideBarComponent.serverId !== params[0]) {
          await ServersSideBarComponent.onUrlServerIdChanged(params[0]);
        }
      } else if (params.length >= 2) {
        await ServersSideBarComponent.onUrlChannelIdChanged(params[1]);
      }
    }
  };

  static async onUrlServerIdChanged(serverId: string): Promise<void> {
    appStore.resetChannels();
    await appStore.fetchChannels(serverId);
    ServersScreen.server = appStore.getServer(serverId);
    ServersSideBarComponent.serverId = serverId;
    ServersSideBarComponent.channelId = null;
    ServersSideBarComponent.instance.displayCreateChannelContainer();
    if (appStore.channels[0]) {
      Router.push(RouteControllers.Servers, '', [ServersSideBarComponent.serverId, appStore.channels[0].id]);
      return;
    }
  }

  static async onUrlChannelIdChanged(channelId: string): Promise<void> {
    if (!ServersSideBarComponent.serverId) {
      return;
    }
    if (ServersSideBarComponent.channelId === channelId) {
      return;
    }
    ServersScreen.channel = appStore.getChannel(channelId);
    ServersSideBarComponent.channelId = channelId;
    ServersSideBarView.toggleActiveStatus(channelId);
    await new MainComponent().init();
  }

  bindSocketEvents() {
    socket.removeListener('userChangedAvailability', ServersSideBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ServersSideBarComponent.onSocketUserAvailabilityChangedServer);

    socket.removeListener('userInvitedToChannel', ServersSideBarComponent.onSocketUserInvitedToChannel);
    socket.on(
      'userInvitedToChannel',
      (ServersSideBarComponent.onSocketUserInvitedToChannel = async ({ userId, channelId }) => {
        if (!appStore.user) {
          return;
        }
        await appStore.fetchUserRelatedServers(appStore.user.id);
      })
    );
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

  onChannelItemClick = (serverId: string, channelId: string) => {
    Router.push(RouteControllers.Servers, '', [serverId, channelId]);
  };

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};
}

export default ServersSideBarComponent;
