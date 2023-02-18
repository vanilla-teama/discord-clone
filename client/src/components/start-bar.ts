import Controller from '../lib/controller';
import StartBarView from '../views/start-bar-view';
import ChatsBarComponent from './chats-bar';
import ServersBarComponent from './servers-bar';
import ScreenView from '../views/screen-view';
class StartBarComponent extends Controller<StartBarView> {
  constructor() {
    super(new StartBarView());
  }

  async init(): Promise<void> {
    this.view.render();
    new ChatsBarComponent().init();
    new ServersBarComponent().init();
    this.view.bindShowSideBarClick(ScreenView.showSideBar);
  }
}

export default StartBarComponent;
