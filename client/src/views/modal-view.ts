import View from '../lib/view';
import { $, isClosestElementOfCssClass, isElementOfCssClass } from '../utils/functions';
import ModalPortalView from './modal-portal-view';
import PopupView from './popup-view';

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
    const $root = ModalPortalView.$modalPortal;
    if (!$root) {
      ModalView.throwNoRootInTheDomError('Modal');
    }
    super($root);
    ModalView.$modal = $('div', ModalView.classNames.modal);
    ModalView.$container = $('div', ModalView.classNames.container);
    // ModalView.$portal = $root;
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
    PopupView.hide();

    window.removeEventListener('keyup', ModalView.onEscapeKey);
    window.addEventListener(
      'keyup',
      (ModalView.onEscapeKey = (event) => {
        if (!event.key) {
          return;
        }
        const key = event.key.toLowerCase();
        if (key === 'escape') {
          ModalView.hide();
        }
      })
    );
  }

  static hide(): void {
    const $modal = ModalView.$modal;
    if (!$modal) {
      return;
    }
    $modal.onanimationend = () => {
      $modal.classList.remove(ModalView.classNames.show, ModalView.classNames.hiding);
      $modal.onanimationend = null;
    };
    $modal.classList.add(ModalView.classNames.hiding);
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

  static onEscapeKey = (event: KeyboardEvent): void => {};
}

export default ModalView;
