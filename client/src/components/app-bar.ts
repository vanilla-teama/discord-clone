import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { isKeyOf } from '../utils/functions';
import AppBarView from '../views/app-bar-view';
import ChatsAppBarComponent from './chats-app-bar';
import FriendsAppBarComponent from './friends-app-bar';
import ServersAppBarComponent from './servers-app-bar';

const routes = {
  [RouteControllers.Chats]: ChatsAppBarComponent,
  [RouteControllers.Servers]: ServersAppBarComponent,
  [RouteControllers.Friends]: FriendsAppBarComponent,
} as const;

class AppBarComponent extends Controller<AppBarView> {
  constructor() {
    super(new AppBarView());
  }

  async init(): Promise<void> {
    const controller = new Router().getController();
    if (isKeyOf(controller, routes)) {
      new routes[controller]().init();
    }
  }
}

export default AppBarComponent;
