import Controller from '../lib/controller';
import ErrorModalView from '../views/error-modal-view';
import ModalComponent from './modal';

class ErrorModalComponent extends Controller<ErrorModalView> {
  constructor() {
    new ModalComponent().init();
    super(new ErrorModalView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.show();
  }
}

export default ErrorModalComponent;
