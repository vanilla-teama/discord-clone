import Controller from '../lib/controller';
import ModalView from '../views/modal-view';

class ModalComponent extends Controller<ModalView> {
  constructor() {
    super(new ModalView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ModalComponent;
