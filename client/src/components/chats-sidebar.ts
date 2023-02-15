import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat, User } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsSideBarView from '../views/chats-sidebar-view';
import { PopupCoords } from '../views/popup-view';
import ChatsCreateFormComponent from './chats-create-form';
import ChatsScreen from './chats-screen';
import PopupComponent from './popup';

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
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.chats);
    this.bindRouteChanged();
    ChatsScreen.bindChatUpdate('sidebar', this.onChatUpdate);
    this.bindSocketEvents();
    this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (chats: Chat[]): void => {
    this.view.displayChats(chats);
  };

  onChatUpdate = (chat: Chat): void => {
    this.view.updateChat(chat);
    this.toggleActiveStatus();
  };

  onShowCreateChat = (coords: PopupCoords) => {
    new PopupComponent(coords, ChatsCreateFormComponent).init();
  };

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    this.view.toggleActiveStatus(params[0]);
  }

  bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, ChatsSideBarComponent.onRouteChanged);
    document.addEventListener(
      CustomEvents.AFTERROUTERPUSH,
      (ChatsSideBarComponent.onRouteChanged = (event) => {
        const {
          detail: { controller, params },
        } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

        if (controller === RouteControllers.Chats && params.length > 0) {
          this.view.toggleActiveStatus(params[0]);
        }
      })
    );
  }

  bindSocketEvents() {
    socket.removeListener('userChangedAvailability', ChatsSideBarComponent.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsSideBarComponent.onSocketUserAvailabilityChangedServer);

    socket.removeListener('userInvited', ChatsSideBarComponent.onSocketUserInvited);
    socket.on(
      'userInvited',
      (ChatsSideBarComponent.onSocketUserInvited = async ({ userId }) => {
        if (!appStore.user) {
          return;
        }
        if (appStore.user.id !== userId) {
          return;
        }
        await appStore.fetchCurrentUser();
        this.view.displayFriendsBlockStatus(appStore.user.invitesFrom.length);
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

  navigateToFriends: EventListener = () => {
    Router.push(RouteControllers.Friends);
  };

  static onSocketUserInvited: ServerToClientEvents['userInvited'] = () => {};

  static onRouteChanged: EventListener = () => {};
}

export default ChatsSideBarComponent;
