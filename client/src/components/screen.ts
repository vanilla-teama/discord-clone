import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { ServerToClientEvents } from '../types/socket';
import ScreenView from '../views/screen-view';
import ModalPortalComponent from './modal-portal';
import ServersScreen from './servers-screen';

class Screen extends Controller<ScreenView> {
  constructor() {
    super(new ScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.bindSocketEvents();
    this.bindHotKeys();
    await new ModalPortalComponent().init();
  }

  bindHotKeys(): void {
    this.view.bindOnAltArrowKey(this.bindAltArrowKey);
    this.view.bindOnCtrlAltArrowKey(this.bindCtrlAltArrowKey);
  }

  bindSocketEvents() {
    socket.removeListener('serverAdded', Screen.onSocketServerAdded);
    socket.on(
      'serverAdded',
      (Screen.onSocketServerAdded = async ({ serverId, userId }) => {
        await appStore.fetchAllServers();
      })
    );

    socket.removeListener('userInvitedToChannel', Screen.onSocketUserInvitedToChannel);
    socket.on(
      'userInvitedToChannel',
      (Screen.onSocketUserInvitedToChannel = async ({ channelId, userId }) => {
        Promise.all([await appStore.fetchUsers(), await appStore.fetchCurrentUser()]);
      })
    );
  }

  bindAltArrowKey = async (key: 'arrowup' | 'arrowdown'): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    const router = new Router();
    const controller = router.getController();
    const params = router.getParams();
    const chats = appStore.chats;
    const servers = appStore.servers;
    const channels = appStore.channels;
    const forward = key === 'arrowdown';

    if (controller === RouteControllers.Friends) {
      if (chats.length === 0) {
        return;
      }
      Router.push(RouteControllers.Chats, '', [forward ? chats[0].userId : chats[chats.length - 1].userId]);
    } else if (controller === RouteControllers.Chats) {
      // Move between Chats and Friends
      if (chats.length === 0) {
        return;
      }
      const [chatId] = params;
      if (!chatId) {
        Router.push(RouteControllers.Chats, '', [forward ? chats[0].userId : chats[chats.length - 1].userId]);
      } else {
        const chatIdx = chats.findIndex((c) => c.userId === chatId);
        if (chatIdx !== -1) {
          if ((chatIdx === 0 && !forward) || (chatIdx === chats.length - 1 && forward)) {
            Router.push(RouteControllers.Friends);
          } else {
            const pushChat = forward ? chats[chatIdx + 1] || chats[0] : chats[chatIdx - 1] || chats[chats.length - 1];
            Router.push(RouteControllers.Chats, '', [pushChat.userId]);
          }
        }
      }
    } else if (controller === RouteControllers.Servers) {
      // Move between Channels
      if (servers.length === 0) {
        return;
      }
      const [serverId, channelId] = params;
      if (!serverId) {
        Router.push(RouteControllers.Servers, '', [forward ? servers[0].id : servers[servers.length - 1].id]);
      } else if (!channelId) {
        if (channels.length === 0) {
          return;
        }
        Router.push(RouteControllers.Servers, '', [
          serverId,
          forward ? channels[0].id : channels[channels.length - 1].id,
        ]);
      } else {
        const channelIdx = channels.findIndex((c) => c.id === channelId);
        if (channelIdx !== -1) {
          const pushChannel = forward
            ? channels[channelIdx + 1] || channels[0]
            : channels[channelIdx - 1] || channels[channels.length - 1];
          Router.push(RouteControllers.Servers, '', [serverId, pushChannel.id]);
        }
      }
    }
  };

  bindCtrlAltArrowKey = async (key: 'arrowup' | 'arrowdown'): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    const router = new Router();
    const controller = router.getController();
    const params = router.getParams();
    const chats = appStore.chats;
    const servers = appStore.servers;
    const channels = appStore.channels;
    const forward = key === 'arrowdown';
    if (controller === RouteControllers.Chats || controller === RouteControllers.Friends) {
      // We move to Servers
      if (servers.length === 0) {
        return;
      }
      Router.push(RouteControllers.Servers, '', [forward ? servers[0].id : servers[servers.length - 1].id]);
    } else if (controller === RouteControllers.Servers) {
      // We move between Servers and go to Direct messages
      const [serverId] = params;
      if (!serverId) {
        Router.push(RouteControllers.Servers, '', [forward ? servers[0].id : servers[servers.length - 1].id]);
      } else {
        const serverIdx = servers.findIndex((s) => s.id === serverId);
        if (serverIdx !== -1) {
          if ((serverIdx === 0 && !forward) || (serverIdx === servers.length - 1 && forward)) {
            Router.push(RouteControllers.Chats, '', [chats[0]?.userId || '']);
          } else {
            const pushServer = forward
              ? servers[serverIdx + 1] || servers[0]
              : servers[serverIdx - 1] || servers[servers.length - 1];
            Router.push(RouteControllers.Servers, '', [pushServer.id]);
          }
        }
      }
    }
  };

  static onSocketServerAdded: ServerToClientEvents['serverAdded'] = () => {};

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};
}

export default Screen;
