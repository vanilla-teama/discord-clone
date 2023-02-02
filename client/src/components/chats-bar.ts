import Controller from '../lib/controller';
import ChatsBarView from '../views/chats-bar-view';

class ChatsBarComponent extends Controller<ChatsBarView> {
  constructor() {
    super(new ChatsBarView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ChatsBarComponent;
