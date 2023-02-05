import App from '../lib/app';
import Controller from '../lib/controller';
import { isKeyOf } from '../utils/functions';
import AppBarView from '../views/app-bar-view';
import ChatsAppBarComponent from './chats-app-bar';
import ServersAppBarComponent from './servers-app-bar';

const routes = {
  chats: ChatsAppBarComponent,
  servers: ServersAppBarComponent,
} as const;

class AppBarComponent extends Controller<AppBarView> {
  constructor() {
    super(new AppBarView());
  }

  async init(): Promise<void> {
    const controller = App.getRouter().getController();
    if (isKeyOf(controller, routes)) {
      new routes[controller]().init();
    }
  }
}

export default AppBarComponent;
