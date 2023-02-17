import View from '../lib/view';
import ModalView from './modal-view';

class ErrorModalView extends View {
  constructor() {
    const $root = ModalView.getContainer();
    if (!$root) {
      ErrorModalView.throwNoRootInTheDomError('Error-Modal');
    }
    super($root);
  }
  build(): void {
    this.$container.append('HEEEEEEEEEEEEEEEEHEHEH');
  }

  show(): void {
    ModalView.show();
  }

  hide(): void {
    ModalView.hide();
  }
}

export default ErrorModalView;
