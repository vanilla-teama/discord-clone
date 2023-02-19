import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
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
    this.view.bindOnMutualServerClick(this.redirectToMutualServer);
    this.view.render();
    this.bindSocketEvents();
    ChatsScreen.bindChatUpdate('infobar', this.onChatUpdate);
    if (this.chat) {
      this.view.displayStatus(this.chat.availability);
      this.displayMutualServers();
    }
  }

  displayMutualServers() {
    if (!this.chat) {
      return;
    }
    const mutualServers = appStore.getMutualServers(this.chat.userId);
    console.log(mutualServers);
    this.view.displayMutualServers(mutualServers);
  }

  bindSocketEvents() {
    socket.removeListener('userChangedAvailability', ChatsInfoBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsInfoBarComponent.onSocketUserAvailabilityChangedServer);

    socket.removeListener('userInvitedToChannel', ChatsInfoBarComponent.onSocketUserInvitedToChannel);
    socket.on('userInvitedToChannel', async ({ userId, channelId }) => {
      if (!appStore.user || appStore.user.id !== userId) {
        return;
      }
      await Promise.all([
        await appStore.fetchCurrentUser(),
        await appStore.fetchUsers(),
        await appStore.fetchUserRelatedServers(appStore.user.id),
        await appStore.fetchAllServers(),
      ]);
      console.log(appStore.user);
      this.displayMutualServers();
    });
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

  redirectToMutualServer = (serverId: string): void => {
    Router.push(RouteControllers.Servers, '', [serverId]);
  };

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};
}

export default ChatsInfoBarComponent;
