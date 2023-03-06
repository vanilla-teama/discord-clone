import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat, User } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsSideBarView, { ChatWithAvatar } from '../views/chats-sidebar-view';
import { PopupCoords } from '../views/popup-view';
import ChatsCreateFormComponent from './chats-create-form';
import ChatsScreen from './chats-screen';
import PopupComponent from './popup';
import ScreenView from '../views/screen-view';
class ChatsSideBarComponent extends Controller<ChatsSideBarView> {
  // Keeps last instance of itself
  static instance: ChatsSideBarComponent;

  constructor() {
    super(new ChatsSideBarView());
    ChatsSideBarComponent.instance = this;
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    this.view.bindOnFriendsButtonClick(this.navigateToFriends);
    this.view.render();
    this.view.bindShowCreateChat(this.onShowCreateChat);
    this.view.bindOnChatDelete(this.onChatDelete);
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.chats);
    this.bindRouteChanged();
    this.bindAccountUpdated();
    ChatsScreen.bindChatUpdate('sidebar', this.onChatUpdate);
    this.bindSocketEvents();
    this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
    appStore.bindChatListChanged(this.onChatListChanged);
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (chats: Chat[]): void => {
    this.view.displayChats(chats.map((chat) => this.extendChatWithAvatar(chat)));
  };

  extendChatWithAvatar(chat: Chat): ChatWithAvatar {
    const { userId: chatUserId } = chat;
    const user = appStore.users.find(({ id }) => id === chatUserId);
    if (user?.profile?.avatar) {
      return { ...chat, avatar: user.profile.avatar };
    }
    return chat;
  }

  onChatUpdate = (chat: Chat): void => {
    this.view.updateChat(chat);
    this.toggleActiveStatus();
  };

  onChatDelete = async (userId: string): Promise<void> => {
    await appStore.deleteChat(userId);
    if (appStore.chats.length) {
      Router.push(RouteControllers.Chats, '', [appStore.chats[0].userId]);
    } else {
      Router.push(RouteControllers.Friends);
    }
  };

  onShowCreateChat = (coords: PopupCoords) => {
    new PopupComponent(coords, ChatsCreateFormComponent).init();
  };

  toggleActiveStatus() {
    const router = new Router();
    const controller = router.getController();
    const params = router.getParams();
    if (controller === RouteControllers.Chats) {
      this.view.toggleChatLinksActiveStatus(params[0]);
      this.view.toggleFriendsLinkActiveStatus(false);
    } else if (controller === RouteControllers.Friends) {
      this.view.toggleChatLinksActiveStatus(null);
      this.view.toggleFriendsLinkActiveStatus(true);
    }
  }

  bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, ChatsSideBarComponent.onRouteChanged);
    document.addEventListener(
      CustomEvents.AFTERROUTERPUSH,
      (ChatsSideBarComponent.onRouteChanged = (event) => {
        const {
          detail: { controller, params },
        } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);
        this.toggleActiveStatus();
      })
    );
  }

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, ChatsSideBarComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (ChatsSideBarComponent.onAccountUpdated = (event) => {
        const {
          detail: { user },
        } = getTypedCustomEvent(CustomEvents.ACCOUNTUPDATED, event);
        if (!user) {
          return;
        }
        const chat = appStore.chats.find((c) => c.userId === user.id);
        if (chat) {
          this.view.updateChat({ ...chat, avatar: user.profile?.avatar || undefined });
          this.toggleActiveStatus();
        }
      })
    );
  }

  bindSocketEvents() {
    socket.removeListener('userChangedAvailability', ChatsSideBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsSideBarComponent.onSocketUserAvailabilityChangedServer);

    socket.removeListener('userInvitedToFriends', ChatsSideBarComponent.onSocketUserInvitedToFriends);
    socket.on(
      'userInvitedToFriends',
      (ChatsSideBarComponent.onSocketUserInvitedToFriends = async ({ userId }) => {
        if (!appStore.user) {
          return;
        }
        await appStore.fetchCurrentUser();
        this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
      })
    );

    socket.removeListener('userAddedToFriends', ChatsSideBarComponent.onSocketUserAddedToFriends);
    socket.on(
      'userAddedToFriends',
      (ChatsSideBarComponent.onSocketUserAddedToFriends = async ({ userId, friendId }) => {
        if (!appStore.user) {
          return;
        }
        await appStore.fetchCurrentUser();
        this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
      })
    );

    socket.removeListener('friendInvitationCanceled', ChatsSideBarComponent.onSocketFriendInvitationCanceled);
    socket.on(
      'friendInvitationCanceled',
      (ChatsSideBarComponent.onSocketFriendInvitationCanceled = async ({ userId, friendId }) => {
        if (!appStore.user) {
          return;
        }
        await appStore.fetchCurrentUser();
        this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
      })
    );

    socket.removeListener('friendInvitationCanceled', ChatsSideBarComponent.onSocketFriendDeleted);
    socket.on(
      'friendInvitationCanceled',
      (ChatsSideBarComponent.onSocketFriendDeleted = async ({ userId, friendId }) => {
        if (!appStore.user) {
          return;
        }
        await appStore.fetchCurrentUser();
        this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
      })
    );

    // socket.removeListener('personalMessage', ChatsSideBarComponent.onSocketPersonalMessage);
    // socket.on(
    //   'personalMessage',
    //   (ChatsSideBarComponent.onSocketPersonalMessage = async ({ fromUserId, toUserId }) => {
    //     if (!appStore.user || toUserId !== appStore.user.id) {
    //       return;
    //     }
    //     await appStore.createChat([fromUserId]);
    //   })
    // );
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

  navigateToFriends: EventListener = () => {
    Router.push(RouteControllers.Friends);
  };

  static onSocketUserInvitedToFriends: ServerToClientEvents['userInvitedToFriends'] = () => {};

  static onSocketUserAddedToFriends: ServerToClientEvents['userAddedToFriends'] = () => {};

  static onSocketFriendInvitationCanceled: ServerToClientEvents['friendInvitationCanceled'] = () => {};

  static onSocketFriendDeleted: ServerToClientEvents['friendDeleted'] = () => {};

  static onSocketPersonalMessage: ServerToClientEvents['personalMessage'] = () => {};

  static onRouteChanged: EventListener = () => {};

  static onAccountUpdated: EventListener = () => {};
}

export default ChatsSideBarComponent;
