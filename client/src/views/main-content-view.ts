import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class MainContentView extends View {
  static readonly classNames = {};
  constructor() {
    const $root = MainView.$mainContent;
    if (!$root) {
      MainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
  }
  build(): void {}
}

export default MainContentView;
