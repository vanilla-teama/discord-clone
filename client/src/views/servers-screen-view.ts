import View from '../lib/view';
import { $ } from '../utils/functions';

class ServersScreenView extends View {
  static readonly classNames = {
    startBar: 'start-bar',
  };

  static $startBar: HTMLDivElement | null = null;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      throw new Error('Root element not found in index.html. Please, provide an element with id `root`');
    }
    super($root);
    ServersScreenView.$startBar = null;
  }

  build(): void {
    const $startBar = this.createStartBar();
    ServersScreenView.$startBar = $startBar;
    this.$container.append($startBar);
  }

  private createStartBar(): HTMLDivElement {
    const $container = $('div', ServersScreenView.classNames.startBar);
    return $container;
  }
}

export default ServersScreenView;
