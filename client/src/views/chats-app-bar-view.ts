import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ChatsAppBarView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = MainView.$appbar;
    if (!$root) {
      ChatsAppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'main');
    $container.textContent = 'I AM APP-BAR!';

    this.$container.append('I AM CHATS APP-BAR!');
  }
}

export default ChatsAppBarView;
