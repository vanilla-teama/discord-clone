import Controller from '../lib/controller';
import { Channel, Server } from '../types/entities';
import ServersAppBarView from '../views/servers-app-bar-view';
import ServersScreen from './servers-screen';

class ServersAppBarComponent extends Controller<ServersAppBarView> {
  server: Server | null;

  channel: Channel | null;

  constructor() {
    super(new ServersAppBarView());
    this.server = ServersScreen.server;
    this.channel = ServersScreen.channel;
  }

  async init(): Promise<void> {
    this.view.render();
    if (this.channel) {
      this.view.displayChannelName(this.channel.name);
    }
  }
}

export default ServersAppBarComponent;
