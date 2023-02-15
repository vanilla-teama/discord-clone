import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { ServerToClientEvents } from '../types/socket';
import FriendsMainContentView from '../views/friends-main-content-view';

class FriendsMainContentComponent extends Controller<FriendsMainContentView> {
  constructor() {
    super(new FriendsMainContentView());
  }

  async init(): Promise<void> {
    await appStore.fetchFriends();
    await appStore.fetchInvitedToFriends();
    this.view.bindOnSearch(this.onSearch);
    this.view.bindOnInvite(this.onInvite);
    this.view.bindOnSendMessage(this.onSendMessage);
    this.view.render();
    this.bindSocketEvents();
    this.displayFriends();
  }

  static showFriendsContent = (): void => {
    FriendsMainContentView.showFriendsContent();
  };

  static showAddFriendContent = (): void => {
    FriendsMainContentView.showAddFriendContent();
  };

  bindSocketEvents() {
    socket.removeListener('userInvited', FriendsMainContentComponent.onSocketUserInvited);
    socket.on(
      'userInvited',
      (FriendsMainContentComponent.onSocketUserInvited = async ({ userId }) => {
        if (appStore.user?.id === userId) {
          return;
        }
        await appStore.fetchInvitedToFriends();
        this.displayFriends();
      })
    );
  }

  onSearch = async (value: string) => {
    if (!appStore.user) {
      return;
    }
    const userId = appStore.user.id;
    const users = ((await appStore.searchUsers(value)) || []).filter(({ id }) => userId !== id);
    this.view.displayFoundUsers(users, appStore.user);
  };

  onInvite = async (userId: string) => {
    if (!appStore.user) {
      return;
    }
    await Promise.all([
      await appStore.updateUser(appStore.user.id, { invitesTo: [userId] }),
      await appStore.updateUser(userId, { invitesFrom: [appStore.user.id] }),
    ]);
    socket.emit('userInvited', { userId });
    await appStore.fetchInvitedToFriends();
    this.displayFriends();
  };

  displayFriends() {
    this.view.displayFriends(appStore.invitedToFriends, appStore.friends);
  }

  onSendMessage = async (userId: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await appStore.fetchChats(appStore.user.id);
    if (!appStore.chats.find(({ userId: chatUserId }) => userId === chatUserId)) {
      await appStore.createChat([userId]);
    }
    Router.push(RouteControllers.Chats, '', [userId]);
  };

  static onSocketUserInvited: ServerToClientEvents['userInvited'] = () => {};
}

export default FriendsMainContentComponent;
