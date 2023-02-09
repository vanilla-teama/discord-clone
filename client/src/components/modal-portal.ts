import Controller from '../lib/controller';
import ModalPortalView from '../views/modal-portal-view';
import ModalComponent from './modal';

class ModalPortalComponent extends Controller<ModalPortalView> {
  constructor() {
    super(new ModalPortalView());
  }

  async init(): Promise<void> {
    this.view.render();
    // await new ModalComponent().init();
  }
}

export default ModalPortalComponent;
