import App from '../lib/app';
import Controller from '../lib/controller';
import { isKeyOf } from '../utils/functions';
import MainContentView from '../views/main-content-view';
import ChatsMainContentComponent from './chats-main-content';

const routes = {
  chats: ChatsMainContentComponent,
} as const;

class MainContentComponent extends Controller<MainContentView> {
  constructor() {
    super(new MainContentView());
  }

  async init(): Promise<void> {
    const controller = App.getRouter().getController();
    if (isKeyOf(controller, routes)) {
      new routes[controller]().init();
    }
  }
}

export default MainContentComponent;
