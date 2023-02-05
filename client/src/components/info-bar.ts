import App from '../lib/app';
import Controller from '../lib/controller';
import { isKeyOf } from '../utils/functions';
import InfoBarView from '../views/info-bar-view';
import ChatsInfoBarComponent from './chats-info-bar';

const routes = {
  chats: ChatsInfoBarComponent,
} as const;

class InfoBarComponent extends Controller<InfoBarView> {
  constructor() {
    super(new InfoBarView());
  }

  async init(): Promise<void> {
    const controller = App.getRouter().getController();
    if (isKeyOf(controller, routes)) {
      new routes[controller]().init();
    }
  }
}

export default InfoBarComponent;
