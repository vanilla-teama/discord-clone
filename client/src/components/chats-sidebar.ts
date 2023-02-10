import App from '../lib/app';
import Controller from '../lib/controller';
import { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Chat, User } from '../types/entities';
import { CustomEventData as CustomEventType, CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import { bindEvent as bindSocketEvent } from '../lib/socket';
import ChatsSideBarView from '../views/chats-sidebar-view';
import PopupComponent from './popup';
import { PopupCoords } from '../views/popup-view';
import ChatsCreateFormComponent from './chats-create-form';

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
    this.view.render();
    this.view.bindShowCreateChat(this.onShowCreateChat);
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.chats);
    this.bindRouteChanged();
    this.bindSocketUserLoggedInServer();
    appStore.bindChatLocallyUpdate(this.onChatUpdate);
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (chats: Chat[]): void => {
    this.view.displayChats(chats);
    // this.toggleActiveStatus();
  };

  onChatUpdate = (chat: Chat): void => {
    this.view.updateChat(chat);
  };

  onShowCreateChat = (coords: PopupCoords) => {
    new PopupComponent(coords, ChatsCreateFormComponent).init();
  };

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    this.view.toggleActiveStatus(params[0]);
  }

  bindRouteChanged() {
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, (event) => {
      const {
        detail: { controller, params },
      } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

      if (controller === RouteControllers.Chats && params.length > 0) {
        this.view.toggleActiveStatus(params[0]);
      }
    });
  }

  bindSocketUserLoggedInServer() {
    bindSocketEvent('userLoggedInServer', ({ user }) => {
      appStore.updateChatLocally(user.id, { availability: user.availability });
    });
  }
}

export default ChatsSideBarComponent;
