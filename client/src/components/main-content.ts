import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { isKeyOf } from '../utils/functions';
import MainContentView from '../views/main-content-view';
import ChatsMainContentComponent from './chats-main-content';
import FriendsMainContentComponent from './friends-main-content';
import ServersMainContentComponent from './servers-main-content';

const routes = {
  [RouteControllers.Chats]: ChatsMainContentComponent,
  [RouteControllers.Servers]: ServersMainContentComponent,
  [RouteControllers.Friends]: FriendsMainContentComponent,
} as const;

class MainContentComponent extends Controller<MainContentView> {
  constructor() {
    super(new MainContentView());
  }

  async init(): Promise<void> {
    const controller = new Router().getController();
    if (isKeyOf(controller, routes)) {
      await new routes[controller]().init();
    }
  }
}

export default MainContentComponent;
