import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class InfoBarView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = MainView.$infobar;
    if (!$root) {
      InfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
  }
  build(): void {}

  static show(): void {
    if (MainView.$infobar) {
      MainView.$infobar.style.display = 'flex';
      MainView.$infobar.classList.add('info-bar_show');
    }
  }

  static hide(): void {
    if (MainView.$infobar) {
      MainView.$infobar.onanimationend = () => {
        if (MainView.$infobar) {
          MainView.$infobar.classList.remove('info-bar_show');
          MainView.$infobar.classList.remove('info-bar_hiding');
          MainView.$infobar.style.display = 'none';
          MainView.$infobar.onanimationend = null;
        }
      };
      MainView.$infobar.classList.add('info-bar_hiding');
    }
  }

  static toggle(): void {
    if (MainView.$infobar) {
      if (MainView.$infobar.classList.contains('info-bar_show')) {
        InfoBarView.hide();
      } else {
        InfoBarView.show();
      }
    }
  }
}

export default InfoBarView;
