import Controller from '../lib/controller';
import AppStore from '../store/app-store';
import ServersScreenView from '../views/servers-screen-view';
import StartBarComponent from './start-bar';

class ServersScreen extends Controller<ServersScreenView> {
  constructor() {
    super(new ServersScreenView());
  }

  async init(): Promise<void> {
    const appStore = AppStore.Instance;
    await appStore.fetchUsers();
    await appStore.fetchServers();

    this.view.render();
    new StartBarComponent().init();
  }
}

export default ServersScreen;
