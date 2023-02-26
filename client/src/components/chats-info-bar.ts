import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
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
    this.bindAccountUpdated();
    ChatsScreen.bindChatUpdate('infobar', this.onChatUpdate);
    if (this.chat) {
      this.view.displayStatus(this.chat.availability);
      this.displayMutualServers();
      this.displayProfileData();
    }
  }

  displayProfileData() {
    if (this.chat) {
      const { userId: chatUserId } = this.chat;
      const user = appStore.users.find(({ id }) => id === chatUserId);
      if (user?.profile) {
        this.view.displayUsername(user.name);
        this.view.displayAvatar(user.profile.avatar);
        this.view.displayBanner(user.profile.banner);
        this.view.displayAbout(user.profile.about);
      }
    }
  }

  displayMutualServers() {
    if (!this.chat) {
      return;
    }
    const mutualServers = appStore.getMutualServers(this.chat.userId);
    this.view.displayMutualServers(mutualServers);
  }

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, ChatsInfoBarComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (ChatsInfoBarComponent.onAccountUpdated = (event) => {
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
          this.displayProfileData();
        }
      })
    );
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

  static onAccountUpdated: EventListener = () => {};
}

export default ChatsInfoBarComponent;
