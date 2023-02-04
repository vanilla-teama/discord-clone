import View from '../lib/view';
import { User } from '../types/entities';
import { $ } from '../utils/functions';

class StartScreenView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      throw new Error('Root element not found in index.html. Please, provide an element with id `root`');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'start-screen');
    $container.textContent = 'Start Screen';
    this.$container.append($container);
  }
}

export default StartScreenView;
