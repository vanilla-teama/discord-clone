import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ServersMainContentView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = MainView.$mainContent;
    if (!$root) {
      ServersMainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'main');
    $container.textContent = '!';

    this.$container.append('I AM SERVERS MAIN CONTENT!');
  }
}

export default ServersMainContentView;
