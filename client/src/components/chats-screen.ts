import Controller from '../lib/controller';
import AppStore from '../store/app-store';
import ChatsScreenView from '../views/chats-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import StartBarComponent from './start-bar';

class ChatsScreen extends Controller<ChatsScreenView> {
  constructor() {
    super(new ChatsScreenView());
  }

  async init(): Promise<void> {
    const appStore = AppStore.Instance;
    await appStore.fetchUsers();
    await appStore.fetchServers();
    await appStore.fetchPersonalMessages('1');
    await appStore.fetchChats('1');

    this.view.render();

    new StartBarComponent().init();
    new ChatsSideBarComponent().init();
  }
}

export default ChatsScreen;
