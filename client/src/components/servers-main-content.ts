import Controller from '../lib/controller';
import ChatsMainContentView from '../views/chats-main-content-view';

class ServersMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ServersMainContentComponent;
