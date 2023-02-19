import Controller from '../lib/controller';
import { Channel, Server } from '../types/entities';
import MainView from '../views/main-view';
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
    this.bindShowInfoBarClick();
  }

  bindShowInfoBarClick = (): void => {
    this.view.bindShowInfoBarClick(this.toggleInfoBar);
    MainView.bindToggleInfoBar(this.view.setShowInfoBarButtonHideTooltip, this.view.setShowInfoBarButtonShowTooltip);
  };

  toggleInfoBar = (): void => {
    MainView.toggleInfoBar();
  };
}

export default ServersAppBarComponent;
