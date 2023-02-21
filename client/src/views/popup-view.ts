import View from '../lib/view';
import { $, isClosestElementOfCssClass, isElementOfCssClass } from '../utils/functions';
import ModalPortalView from './modal-portal-view';
import ModalView from './modal-view';

export type PopupCoords = { top: number; left: number };

class PopupView extends View {
  static readonly classNames = {
    popup: 'popup',
    container: 'popup__container',
    show: 'show',
    hiding: 'hiding',
  };

  // TODO: Add positioning for edge cases
  private static coords: PopupCoords;

  static $portal: HTMLDivElement;
  private static $popup: HTMLDivElement;
  private static $container: HTMLDivElement;

  constructor(coords: PopupCoords) {
    const $root = ModalPortalView.$popupPortal;
    if (!$root) {
      PopupView.throwNoRootInTheDomError('Popup');
    }
    super($root);
    PopupView.coords = coords;
    PopupView.$popup = $('div', PopupView.classNames.popup);
    PopupView.$container = $('div', PopupView.classNames.container);

    PopupView.$popup.style.top = coords.top + 'px';
    PopupView.$popup.style.left = coords.left + 'px';
  }
  build(): void {
    PopupView.$popup.append(PopupView.$container);
    this.$container.append(PopupView.$popup);
  }

  static getContainer() {
    return PopupView.$container;
  }

  static show(): void {
    PopupView.setPopupCoords();
    PopupView.$popup.onanimationend = null;
    PopupView.$popup.onanimationend = () => {
      PopupView.bindScreenClick();
      PopupView.$popup.onanimationend = null;
    };
    PopupView.$popup.classList.add(PopupView.classNames.show);
  }

  static hide(): void {
    const $popup = PopupView.$popup;
    if (!$popup) {
      return;
    }
    $popup.onanimationend = () => {
      $popup.classList.remove(PopupView.classNames.show, PopupView.classNames.hiding);
      $popup.onanimationend = null;
      PopupView.resetPopupCoords();
    };
    $popup.classList.add(PopupView.classNames.hiding);
    document.removeEventListener('click', PopupView.onScreenClick);
  }

  static bindScreenClick(): void {
    document.removeEventListener('click', PopupView.onScreenClick);
    document.addEventListener('click', PopupView.onScreenClick);
  }

  static onScreenClick: EventListener = (event) => {
    if (isClosestElementOfCssClass(event.target, PopupView.classNames.container)) {
      return;
    }
    PopupView.hide();
  };

  static setPopupCoords() {
    const { top, left } = PopupView.coords;
    PopupView.$popup.style.top = top - window.scrollY + 'px';
    PopupView.$popup.style.left = left - window.scrollX + 'px';
  }

  static resetPopupCoords() {
    PopupView.$popup.style.top = 'initial';
    PopupView.$popup.style.left = 'initial';
  }
}

export default PopupView;
