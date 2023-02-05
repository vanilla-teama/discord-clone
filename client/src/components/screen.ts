import Controller from '../lib/controller';
import ScreenView from '../views/screen-view';

class Screen extends Controller<ScreenView> {
  constructor() {
    super(new ScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default Screen;
