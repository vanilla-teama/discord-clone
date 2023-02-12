import Controller from '../lib/controller';
import ServersMainContentView from '../views/servers-main-content';

class ServersMainContentComponent extends Controller<ServersMainContentView> {
  constructor() {
    super(new ServersMainContentView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ServersMainContentComponent;
