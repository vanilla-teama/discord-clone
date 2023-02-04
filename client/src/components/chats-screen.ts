import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { bindSocketEvent } from '../lib/socket';
import AppStore, { appStore } from '../store/app-store';
import ChatsScreenView from '../views/chats-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import StartBarComponent from './start-bar';

class ChatsScreen extends Controller<ChatsScreenView> {
  constructor() {
    super(new ChatsScreenView());
    if (!appStore.user) {
      Router.push(RouteControllers.Start);
    }
  }

  async init(): Promise<void> {
    const appStore = AppStore.Instance;
    await appStore.fetchUsers();
    await appStore.fetchServers();
    await appStore.fetchPersonalMessages('1');
    await appStore.fetchChats('1');

    this.view.render();
    if (appStore.user) {
      this.view.displayUser(appStore.user);
    }

    new StartBarComponent().init();
    new ChatsSideBarComponent().init();

    this.bindSocketEvents();
  }

  bindSocketEvents() {
    bindSocketEvent('userLoggedInServer', (data: unknown) => {
      console.log('Chat Screen', 'user logged In', data);
    });
  }
}

export default ChatsScreen;
