import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import FriendsMainContentView from '../views/friends-main-content-view';

class FriendsMainContentComponent extends Controller<FriendsMainContentView> {
  static instance: FriendsMainContentComponent;
  constructor() {
    super(new FriendsMainContentView());
    FriendsMainContentComponent.instance = this;
  }

  async init(): Promise<void> {
    await this.fetchAllFriends();
    this.bindAccountUpdated();
    this.view.bindOnSearch(this.onSearch);
    this.view.bindOnInvite(this.onInvite);
    this.view.bindOnSendMessage(this.onSendMessage);
    this.view.bindOnAcceptInvitation(this.onAcceptInvitation);
    this.view.bindOnCancelInvitation(this.onCancelInvitation);
    this.view.bindOnDeleteFriend(this.onDeleteFriend);
    this.view.render();
    this.showContent();
    this.bindSocketEvents();
    this.displayAllFriends();
  }

  showContent() {
    const router = new Router();
    const params = router.getParams();
    if (params[0] === 'addfriend') {
      FriendsMainContentComponent.showAddFriendContent();
    } else {
      FriendsMainContentComponent.showFriendsContent();
    }
  }

  static showFriendsContent = (): void => {
    FriendsMainContentView.showFriendsContent();
  };

  static showAddFriendContent = (): void => {
    FriendsMainContentComponent.instance.resetAddFriendContent();
    FriendsMainContentView.showAddFriendContent();
  };

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, FriendsMainContentComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (FriendsMainContentComponent.onAccountUpdated = async (event) => {
        const {
          detail: { user },
        } = getTypedCustomEvent(CustomEvents.ACCOUNTUPDATED, event);
        if (!user) {
          return;
        }
        await this.fetchAllFriends();
        this.displayAllFriends();
      })
    );
  }

  bindSocketEvents() {
    socket.removeListener('userInvitedToFriends', FriendsMainContentComponent.onSocketUserInvitedToFriends);
    socket.on(
      'userInvitedToFriends',
      (FriendsMainContentComponent.onSocketUserInvitedToFriends = async ({ userId }) => {
        await appStore.fetchInvitedToFriends();
        await appStore.fetchInvitedFromFriends();
        this.displayAllFriends();
      })
    );

    socket.removeListener('userAddedToFriends', FriendsMainContentComponent.onSocketUserAddedToFriends);
    socket.on(
      'userAddedToFriends',
      (FriendsMainContentComponent.onSocketUserAddedToFriends = async ({ userId, friendId }) => {
        await this.fetchAllFriends();
        this.displayAllFriends();
      })
    );

    socket.removeListener('friendInvitationCanceled', FriendsMainContentComponent.onSocketFriendInvitationCanceled);
    socket.on(
      'friendInvitationCanceled',
      (FriendsMainContentComponent.onSocketFriendInvitationCanceled = async ({ userId, friendId }) => {
        await this.fetchAllFriends();
        this.displayAllFriends();
      })
    );

    socket.removeListener('friendDeleted', FriendsMainContentComponent.onSocketFriendDeleted);
    socket.on(
      'friendDeleted',
      (FriendsMainContentComponent.onSocketFriendDeleted = async ({ userId, friendId }) => {
        await this.fetchAllFriends();
        this.displayAllFriends();
      })
    );

    socket.removeListener('userChangedAvailability', FriendsMainContentComponent.onSocketUserChangedAvailability);
    socket.on(
      'userChangedAvailability',
      (FriendsMainContentComponent.onSocketUserChangedAvailability = async ({ userId, availability }) => {
        if (!appStore.user) {
          return;
        }
        const friend = appStore.friends.find((f) => f.id === userId);
        if (friend) {
          friend.availability = availability;
        }
        this.displayAllFriends();
      })
    );
  }

  onSearch = async (value: string) => {
    if (!appStore.user) {
      return;
    }
    const userId = appStore.user.id;
    const users = ((await appStore.searchUsers(value)) || []).filter(
      ({ id }) =>
        userId !== id &&
        ![appStore.friends, appStore.invitedFromFriends, appStore.invitedToFriends].flat().some(({ id: friendId }) => {
          return friendId === id;
        })
    );
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
    socket.emit('userInvitedToFriends', { userId });
    await appStore.fetchInvitedToFriends();
    this.displayAllFriends();
  };

  onAcceptInvitation = async (newFriendId: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await Promise.all([
      await appStore.updateUser(
        appStore.user.id,
        { invitesFrom: [newFriendId], friends: [newFriendId] },
        { remove: ['invitesFrom'] }
      ),
      await appStore.updateUser(
        newFriendId,
        { invitesTo: [appStore.user.id], friends: [appStore.user.id] },
        { remove: ['invitesTo'] }
      ),
    ]);
    socket.emit('userAddedToFriends', { userId: appStore.user.id, friendId: newFriendId });
    await this.fetchAllFriends();
    this.displayAllFriends();
  };

  onCancelInvitation = async (friendId: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await Promise.all([
      await appStore.updateUser(appStore.user.id, { invitesTo: [friendId] }, { remove: ['invitesTo'] }),
      await appStore.updateUser(friendId, { invitesFrom: [appStore.user.id] }, { remove: ['invitesFrom'] }),
    ]);
    socket.emit('friendInvitationCanceled', { userId: appStore.user.id, friendId: friendId });
    await this.fetchAllFriends();
    this.displayAllFriends();
  };

  onDeleteFriend = async (friendId: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await Promise.all([
      await appStore.updateUser(appStore.user.id, { friends: [friendId] }, { remove: ['friends'] }),
      await appStore.updateUser(friendId, { friends: [appStore.user.id] }, { remove: ['friends'] }),
    ]);
    socket.emit('friendDeleted', { userId: appStore.user.id, friendId: friendId });
    await this.fetchAllFriends();
    this.displayAllFriends();
  };

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

  async fetchAllFriends() {
    await Promise.all([
      await appStore.fetchFriends(),
      await appStore.fetchInvitedToFriends(),
      await appStore.fetchInvitedFromFriends(),
    ]);
  }

  displayAllFriends() {
    this.view.displayFriends(appStore.invitedToFriends, appStore.invitedFromFriends, appStore.friends);
  }

  resetAddFriendContent() {
    this.view.resetSearchInputAndFoundList();
  }

  static onSocketUserInvitedToFriends: ServerToClientEvents['userInvitedToFriends'] = () => {};

  static onSocketUserAddedToFriends: ServerToClientEvents['userAddedToFriends'] = () => {};

  static onSocketFriendInvitationCanceled: ServerToClientEvents['friendInvitationCanceled'] = () => {};

  static onSocketFriendDeleted: ServerToClientEvents['friendDeleted'] = () => {};

  static onSocketUserChangedAvailability: ServerToClientEvents['userChangedAvailability'] = () => {};

  static onAccountUpdated: EventListener = () => {};
}

export default FriendsMainContentComponent;
