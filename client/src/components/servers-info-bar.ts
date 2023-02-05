import Controller from '../lib/controller';
import ChatsInfoBarView from '../views/chats-info-bar-view';

class ServersInfoBarComponent extends Controller<ChatsInfoBarView> {
  constructor() {
    super(new ChatsInfoBarView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ServersInfoBarComponent;
