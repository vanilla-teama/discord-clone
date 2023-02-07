import View from '../lib/view';
import { $ } from '../utils/functions';
import ModalPortalView from './modal-portal-view';

class ModalView extends View {
  static readonly classNames = {
    show: 'show',
  };

  static $root: HTMLDivElement;

  constructor() {
    const $root = ModalPortalView.$portal;
    if (!$root) {
      ModalView.throwNoRootInTheDomError('Modal');
    }
    super($root);
    ModalView.$root = $root;
  }
  build(): void {
    this.$container.append($('div', 'modal'));
  }

  static show($content: HTMLElement): void {
    ModalView.$root.innerHTML = '';
    ModalView.$root.append($content);
    ModalView.$root.classList.add(ModalView.classNames.show);
  }

  static hide(): void {
    ModalView.$root.classList.remove(ModalView.classNames.show);
  }
}

export default ModalView;
