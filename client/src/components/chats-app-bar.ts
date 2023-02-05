import Controller from '../lib/controller';
import ChatsAppBarView from '../views/chats-app-bar-view';

class ChatsAppBarComponent extends Controller<ChatsAppBarView> {
  constructor() {
    super(new ChatsAppBarView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ChatsAppBarComponent;
