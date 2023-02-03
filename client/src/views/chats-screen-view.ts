import View from '../lib/view';
import { $ } from '../utils/functions';

class ChatsScreenView extends View {
  static readonly classNames = {
    startBar: 'start-bar',
    chatsSideBar: 'chats-sidebar',
  };

  static $startBar: HTMLDivElement | null;
  static $chatsSideBar: HTMLDivElement | null;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      throw new Error('Root element not found in index.html. Please, provide an element with id `root`');
    }
    super($root);
    ChatsScreenView.$startBar = null;
  }
  build(): void {
    const $startBar = this.createStartBar();
    ChatsScreenView.$startBar = $startBar;
    ChatsScreenView.$chatsSideBar = $('div', ChatsScreenView.classNames.chatsSideBar);
    this.$container.append($startBar, ChatsScreenView.$chatsSideBar);
  }

  private createStartBar(): HTMLDivElement {
    const $container = $('div', ChatsScreenView.classNames.startBar);
    return $container;
  }
}

export default ChatsScreenView;
