import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import AppStore, { appStore } from '../store/app-store';
import { Channel, Server } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ServersScreenView from '../views/servers-screen-view';
import MainComponent from './main';
import Screen from './screen';
import ServersSideBarComponent from './servers-sidebar';
import StartBarComponent from './start-bar';

class ServersScreen extends Controller<ServersScreenView> {
  constructor() {
    super(new ServersScreenView());
  }

  static server: Server | null;
  static channel: Channel | null;

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User not found');
    }
    await appStore.fetchUsers();
    await appStore.fetchUserRelatedServers(appStore.user.id);
    this.bindRouteChanged();

    // Render Layout
    await new Screen().init();

    await new StartBarComponent().init();
    await this.onUrlChanged();
    await new MainComponent().init();
  }

  bindRouteChanged() {
    const handler = async (event: Event): Promise<void> => {
      const {
        detail: { controller, params },
      } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

      if (controller === RouteControllers.Servers && params.length === 1) {
        await this.onUrlChanged();
      }
    };
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, handler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, handler);
  }

  async onUrlChanged(): Promise<void> {
    await new ServersSideBarComponent().init();
  }
}

export default ServersScreen;
