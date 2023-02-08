import View from '../lib/view';
import { $, isClosestElementOfCssClass, isElementOfCssClass } from '../utils/functions';
import ModalPortalView from './modal-portal-view';

class ModalView extends View {
  static readonly classNames = {
    modal: 'modal',
    container: 'modal__container',
    show: 'show',
    hiding: 'hiding',
  };

  static $portal: HTMLDivElement;
  private static $modal: HTMLDivElement;
  private static $container: HTMLDivElement;

  constructor() {
    const $root = ModalPortalView.$portal;
    if (!$root) {
      ModalView.throwNoRootInTheDomError('Modal');
    }
    super($root);
    ModalView.$modal = $('div', ModalView.classNames.modal);
    ModalView.$container = $('div', ModalView.classNames.container);
    ModalView.$portal = $root;
  }
  build(): void {
    ModalView.$modal.append(ModalView.$container);
    this.$container.append(ModalView.$modal);
    this.bindOverlayClick();
  }

  static getContainer() {
    return ModalView.$container;
  }

  static show(): void {
    ModalView.$modal.onanimationend = null;
    ModalView.$modal.classList.add(ModalView.classNames.show);
  }

  static hide(): void {
    ModalView.$modal.onanimationend = () => {
      ModalView.$modal.classList.remove(ModalView.classNames.show, ModalView.classNames.hiding);
      ModalView.$modal.onanimationend = null;
    };
    ModalView.$modal.classList.add(ModalView.classNames.hiding);
  }

  bindOverlayClick(): void {
    ModalView.$modal.onclick = ModalView.onOverlayClick;
  }

  static onOverlayClick: EventListener = (event) => {
    if (isClosestElementOfCssClass(event.target, ModalView.classNames.container)) {
      return;
    }
    ModalView.hide();
  };
}

export default ModalView;
