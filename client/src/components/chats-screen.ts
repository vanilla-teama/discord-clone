import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { bindEvent } from '../lib/socket';
import AppStore, { appStore } from '../store/app-store';
import ChatsScreenView from '../views/chats-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import MainComponent from './main';
import Screen from './screen';
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
    // Render Layout
    await new Screen().init();

    if (appStore.user) {
      this.view.displayUser(appStore.user);
    }

    new StartBarComponent().init();
    new ChatsSideBarComponent().init();
    new MainComponent().init();

    this.bindSocketEvents();
  }

  bindSocketEvents() {
    bindEvent('userLoggedInServer', (data: unknown) => {
      console.log('Chat Screen', 'user logged In', data);
    });
  }
}

export default ChatsScreen;
