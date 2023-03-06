import Controller from '../lib/controller';
import ModalPortalView from '../views/modal-portal-view';
import ScreenView from '../views/screen-view';
import ModalComponent from './modal';

class ModalPortalComponent extends Controller<ModalPortalView> {
  constructor($root: HTMLDivElement | null = ScreenView.$portal) {
    super(new ModalPortalView($root));
  }

  async init(): Promise<void> {
    this.view.render();
    // await new ModalComponent().init();
  }
}

export default ModalPortalComponent;
