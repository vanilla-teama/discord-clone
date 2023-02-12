import Controller from '../lib/controller';
import AppStore from '../store/app-store';
import ServersScreenView from '../views/servers-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import MainComponent from './main';
import Screen from './screen';
import ServersBarComponent from './servers-bar';
import ServersSideBarComponent from './servers-sidebar';
import StartBarComponent from './start-bar';

class ServersScreen extends Controller<ServersScreenView> {
  constructor() {
    super(new ServersScreenView());
  }

  async init(): Promise<void> {
    const appStore = AppStore.Instance;
    await appStore.fetchUsers();
    await appStore.fetchServers();

    // Render Layout
    await new Screen().init();

    new StartBarComponent().init();
    new ServersSideBarComponent().init();
    new MainComponent().init();
  }
}

export default ServersScreen;
