import Controller from '../lib/controller';
import ServersAppBarView from '../views/servers-app-bar-view';

class ServersAppBarComponent extends Controller<ServersAppBarView> {
  constructor() {
    super(new ServersAppBarView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ServersAppBarComponent;
