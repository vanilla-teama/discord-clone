import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ServersInfoBarView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = MainView.$infobar;
    if (!$root) {
      ServersInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'main');
    $container.textContent = 'I AM APP-BAR!';

    this.$container.append('I AM SERVERS INFO-BAR!');
  }
}

export default ServersInfoBarView;
