import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Chat } from '../types/entities';
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
    await this.fetchData();
    // Render Layout
    await new Screen().init();

    if (appStore.user) {
      this.view.displayUser(appStore.user);
    }

    await new StartBarComponent().init();
    await new ChatsSideBarComponent().init();
    {
      const router = new Router();
      const controller = router.getController();
      const params = router.getParams();
      if (!ChatsScreen.chat && appStore.chats.length > 0 && controller === RouteControllers.Chats && !params[0]) {
        Router.push(RouteControllers.Chats, '', [appStore.chats[0].userId]);
      } else if (ChatsScreen.chat && !params[0]) {
        Router.push(RouteControllers.Chats, '', [ChatsScreen.chat.userId]);
      } else {
        Router.push(RouteControllers.Friends, '', ['addfriend']);
      }
    }

    this.bindSocketUserAvailabilityChangedServer();
    appStore.bindChatUpdate(ChatsScreen.onChatUpdate);
  }

  async fetchData() {
    if (!appStore.user) {
      return;
    }
    await Promise.all([
      await appStore.fetchUsers(),
      await appStore.fetchAllServers(),
      await appStore.fetchUserRelatedServers(appStore.user.id),
      await appStore.fetchChats(appStore.user.id),
      await appStore.fetchFriends(),
    ]);
  }

  static bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, ChatsScreen.routeChangeHandler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, ChatsScreen.routeChangeHandler);
  }

  private static routeChangeHandler = async (event: Event): Promise<void> => {
    const user = appStore.user;
    if (!user) {
      return;
    }

    const router = new Router();
    const controller = router.getController();
    const params = router.getParams();

    if (controller === RouteControllers.Chats && params.length > 0) {
      ChatsScreen.onUrlChatIdChanged(params[0]);
    } else if (controller === RouteControllers.Friends) {
      await new MainComponent().init();
    }
  };

  private static async onUrlChatIdChanged(chatId: Chat['userId']): Promise<void> {
    if (ChatsScreen.chat?.id === chatId) {
      return;
    }
    ChatsScreen.chat = appStore.chats.find((chat) => chat.userId === chatId) || null;
    if (ChatsScreen.chat) {
      await new MainComponent().init();
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
