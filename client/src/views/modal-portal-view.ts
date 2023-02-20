import View from '../lib/view';
import { $ } from '../utils/functions';
import ScreenView from './screen-view';

class ModalPortalView extends View<HTMLDivElement> {
  static readonly classNames = {
    portal: 'portal',
  };

  static $modalPortal: HTMLDivElement | null = null;
  static $popupPortal: HTMLDivElement | null = null;

  constructor($root: HTMLDivElement | null = ScreenView.$portal) {
    if (!$root) {
      ModalPortalView.throwNoRootInTheDomError('Portal');
    }
    super($root);
  }
  build(): void {
    ModalPortalView.$modalPortal = $('div', 'modal-portal');
    ModalPortalView.$popupPortal = $('div', 'popup-portal');
    this.$container.append(ModalPortalView.$modalPortal, ModalPortalView.$popupPortal);
  }
}

export default ModalPortalView;
