import View from '../lib/view';
import { $ } from '../utils/functions';
import ScreenView from './screen-view';

class ModalPortalView extends View<HTMLDivElement> {
  static readonly classNames = {
    portal: 'modal-portal',
  };

  static $portal: HTMLDivElement | null = null;

  constructor() {
    const $root = ScreenView.$modalPortal;
    if (!$root) {
      ModalPortalView.throwNoRootInTheDomError('Modal-Portal');
    }
    super($root);
  }
  build(): void {
    ModalPortalView.$portal = this.$root;
  }
}

export default ModalPortalView;
