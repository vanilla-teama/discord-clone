import App from '../lib/app';
import Controller from '../lib/controller';
import { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Chat, User } from '../types/entities';
import { CustomEventData as CustomEventType, CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsSideBarView from '../views/chats-sidebar-view';

class ChatsSideBarComponent extends Controller<ChatsSideBarView> {
  constructor() {
    super(new ChatsSideBarView());
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    this.view.render();
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.chats);
    this.bindRouteChanged();
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (chats: Chat[]): void => {
    this.view.displayChats(chats);
    this.toggleActiveStatus();
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
}

export default ChatsSideBarComponent;
