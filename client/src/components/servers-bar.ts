import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { Server } from '../types/entities';
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
  }

  onServerListChanged = (servers: Server[]) => {
    this.view.displayServers(servers);
  };

  async handleAddServer(server: Partial<Server>) {
    // Store server in the database and get Id
    const id = Math.ceil(Math.random() * 100).toString();
    appStore.addServer({ ...server, id } as Server);
  }
}

export default ServersBarComponent;
