import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class AppBarView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = MainView.$appbar;
    if (!$root) {
      AppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'main');
    $container.textContent = 'I AM APP-BAR!';

    this.$container.append('I AM APP-BAR!');
  }
}

export default AppBarView;
