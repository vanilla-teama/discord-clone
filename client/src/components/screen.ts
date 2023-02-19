import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { ServerToClientEvents } from '../types/socket';
import ScreenView from '../views/screen-view';
import ModalPortalComponent from './modal-portal';

class Screen extends Controller<ScreenView> {
  constructor() {
    super(new ScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.bindSocketEvents();
    await new ModalPortalComponent().init();
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

  static onSocketServerAdded: ServerToClientEvents['serverAdded'] = () => {};

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};
}

export default Screen;
