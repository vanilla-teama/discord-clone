import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { isKeyOf } from '../utils/functions';
import InfoBarView from '../views/info-bar-view';
import ChatsInfoBarComponent from './chats-info-bar';
import ServersInfoBarComponent from './servers-info-bar';

const routes = {
  [RouteControllers.Chats]: ChatsInfoBarComponent,
  [RouteControllers.Servers]: ServersInfoBarComponent,
} as const;

class InfoBarComponent extends Controller<InfoBarView> {
  constructor() {
    super(new InfoBarView());
  }

  async init(): Promise<void> {
    const controller = new Router().getController();
    if (isKeyOf(controller, routes)) {
      new routes[controller]().init();
    }
  }
}

export default InfoBarComponent;
