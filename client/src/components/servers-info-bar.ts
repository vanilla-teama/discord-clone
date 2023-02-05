import Controller from '../lib/controller';
import ChatsInfoBarView from '../views/chats-info-bar-view';
import ServersInfoBarView from '../views/servers-info-bar';

class ServersInfoBarComponent extends Controller<ServersInfoBarView> {
  constructor() {
    super(new ServersInfoBarView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ServersInfoBarComponent;
