import App from '../lib/app';
import Controller from '../lib/controller';
import { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Server } from '../types/entities';
import { CustomEvent, CustomEvents } from '../types/types';
import ServersBarView from '../views/servers-bar-view';

class ServersBarComponent extends Controller<ServersBarView> {
  constructor() {
    super(new ServersBarView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.onServerListChanged(appStore.servers);
    this.view.bindAddServer(this.handleAddServer);
    appStore.bindServerListChanged(this.onServerListChanged);
    this.bindRouteChanged();
  }

  onServerListChanged = (servers: Server[]) => {
    this.view.displayServers(servers);
    this.toggleActiveStatus();
  };

  async handleAddServer(server: Partial<Server>) {
    // Store server in the database and get Id
    const id = Math.ceil(Math.random() * 100).toString();
    appStore.addServer({ ...server, id } as Server);
  }

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    this.view.toggleActiveStatus(params[0]);
  }

  bindRouteChanged() {
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, (event) => {
      const {
        detail: { controller, params },
      } = event as unknown as CustomEvent[CustomEvents.AFTERROUTERPUSH];
      if (controller === RouteControllers.Servers && params.length > 0) {
        this.view.toggleActiveStatus(params[0]);
      }
    });
  }
}

export default ServersBarComponent;
