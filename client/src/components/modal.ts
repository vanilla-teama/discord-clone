import Controller from '../lib/controller';
import ModalView from '../views/modal-view';

class ModalComponent extends Controller<ModalView> {
  constructor() {
    super(new ModalView());
  }

  async init(): Promise<void> {
    console.log('modal init');
    this.view.render();
  }
}

export default ModalComponent;
