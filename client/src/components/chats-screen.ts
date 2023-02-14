import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Availability, Chat } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ChatsScreenView from '../views/chats-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import MainComponent from './main';
import Screen from './screen';
import StartBarComponent from './start-bar';

type HandlerName = 'appbar' | 'sidebar' | 'main-content' | 'infobar';

class ChatsScreen extends Controller<ChatsScreenView> {
  static chat: Chat | null = null;

  constructor() {
    super(new ChatsScreenView());
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    await appStore.fetchUsers();
    await appStore.fetchServers();
    await appStore.fetchChats(appStore.user.id);
    // Render Layout
    await new Screen().init();

    if (appStore.user) {
      this.view.displayUser(appStore.user);
    }

    await new StartBarComponent().init();
    await new ChatsSideBarComponent().init();
    await new MainComponent().init();

    this.maybeRedirectToFirstChat(appStore.chats);
    this.bindSocketUserAvailabilityChangedServer();
    appStore.bindChatUpdate(ChatsScreen.onChatUpdate);
  }

  static bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, ChatsScreen.routeChangeHandler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, ChatsScreen.routeChangeHandler);
  }

  private static routeChangeHandler = (event: Event): void => {
    const user = appStore.user;
    if (!user) {
      return;
    }

    const {
      detail: { controller, params },
    } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

    if (controller === RouteControllers.Chats && params.length > 0) {
      ChatsScreen.onUrlChatIdChanged(params[0]);
    }
  };

  private maybeRedirectToFirstChat(chats: Chat[] | null | undefined): void {
    if (!chats || chats.length === 0) {
      return;
    }
    Router.push(RouteControllers.Chats, '', [chats[0].userId]);
  }

  private static onUrlChatIdChanged(chatId: Chat['userId']) {
    ChatsScreen.chat = appStore.chats.find((chat) => chat.userId === chatId) || null;
    if (ChatsScreen.chat) {
      // new StartBarComponent().init();
      // new ChatsSideBarComponent().init();
      new MainComponent().init();
    }
  }

  bindSocketUserAvailabilityChangedServer() {
    socket.removeListener('userChangedAvailability', ChatsScreen.onSocketUserAvailabilityChangedServer);
    socket.on('userChangedAvailability', ChatsScreen.onSocketUserAvailabilityChangedServer);
  }

  static onSocketUserAvailabilityChangedServer = async ({ userId }: { userId: string }): Promise<void> => {
    if (appStore.user) {
      if (appStore.user.id === userId) {
        return;
      }
      console.log('onSocketUserAvailabilityChangedServer', appStore.user.id, userId);
      await appStore.fetchChat(appStore.user.id, userId);
    }
  };

  static chatUpdateHandlers: Record<HandlerName, (chat: Chat) => void> = {
    appbar: (chat: Chat) => {},
    sidebar: (chat: Chat) => {},
    infobar: (chat: Chat) => {},
    'main-content': (chat: Chat) => {},
  };

  static bindChatUpdate = (name: HandlerName, callback: (chat: Chat) => void): void => {
    ChatsScreen.chatUpdateHandlers[name] = callback;
  };

  static onChatUpdate = (chat: Chat): void => {
    Object.entries(ChatsScreen.chatUpdateHandlers).forEach(([_, callback]) => callback(chat));
  };
}

export default ChatsScreen;
