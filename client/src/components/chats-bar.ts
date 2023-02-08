import App from '../lib/app';
import Controller from '../lib/controller';
import { RouteControllers } from '../lib/router';
import { bindEvent as bindSocketEvent } from '../lib/socket';
import { appStore } from '../store/app-store';
import ChatsBarView from '../views/chats-bar-view';

class ChatsBarComponent extends Controller<ChatsBarView> {
  constructor() {
    super(new ChatsBarView());
  }

  async init(): Promise<void> {
    this.view.render();

    this.view.toggleActiveStatus(App.getRouter().getController() === RouteControllers.Chats);
  }
}

export default ChatsBarComponent;
