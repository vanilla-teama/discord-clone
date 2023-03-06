import Controller from '../lib/controller';
import MainView from '../views/main-view';
import AppBarComponent from './app-bar';
import InfoBarComponent from './info-bar';
import MainContentComponent from './main-content';

class MainComponent extends Controller<MainView> {
  constructor() {
    super(new MainView());
  }

  async init(): Promise<void> {
    this.view.render();
    await new AppBarComponent().init();
    await new MainContentComponent().init();
    await new InfoBarComponent().init();
  }
}

export default MainComponent;
