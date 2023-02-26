import Controller from '../lib/controller';
import Router from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Channel } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsInfoBarView from '../views/chats-info-bar-view';
import ServersInfoBarView from '../views/servers-info-bar-view';

class ServersInfoBarComponent extends Controller<ServersInfoBarView> {
  channel: Channel | null;

  constructor() {
    super(new ServersInfoBarView());
    this.channel = this.getCurrentChannel();
  }

  async init(): Promise<void> {
    this.view.render();
    if (this.channel) {
      this.displayMembers();
    }
    this.bindSocketEvents();
    this.bindAccountUpdated();
  }

  displayMembers() {
    if (!this.channel) {
      return;
    }
    this.view.displayMembers(appStore.getChannelMembers(this.channel.id), appStore.getChannelOwner(this.channel.id));
  }

  getCurrentChannel(): Channel | null {
    const channelId = new Router().getParams()[1];
    return appStore.getChannel(channelId);
  }

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, ServersInfoBarComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (ServersInfoBarComponent.onAccountUpdated = async (event) => {
        const {
          detail: { user },
        } = getTypedCustomEvent(CustomEvents.ACCOUNTUPDATED, event);
        if (!user) {
          return;
        }
        this.displayMembers();
      })
    );
  }

  bindSocketEvents() {
    socket.removeListener('userInvitedToChannel', ServersInfoBarComponent.onSocketUserInvitedToChannel);
    socket.on(
      'userInvitedToChannel',
      (ServersInfoBarComponent.onSocketUserInvitedToChannel = async ({ userId, channelId }) => {
        if (!appStore.user) {
          return;
        }
        this.displayMembers();
      })
    );

    socket.removeListener('userChangedAvailability', ServersInfoBarComponent.onSocketUserChangedAvailability);
    socket.on(
      'userChangedAvailability',
      (ServersInfoBarComponent.onSocketUserChangedAvailability = async ({ userId }) => {
        if (!appStore.user) {
          return;
        }
        console.log('changed availability', userId);
        await appStore.fetchUser(userId);
        this.displayMembers();
      })
    );
  }

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};

  static onSocketUserChangedAvailability: ServerToClientEvents['userChangedAvailability'] = () => {};

  static onAccountUpdated: EventListener = () => {};
}

export default ServersInfoBarComponent;
