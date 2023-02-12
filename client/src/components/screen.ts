import Controller from '../lib/controller';
import ScreenView from '../views/screen-view';
import ModalPortalComponent from './modal-portal';

class Screen extends Controller<ScreenView> {
  constructor() {
    super(new ScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    await new ModalPortalComponent().init();
  }
}

export default Screen;
