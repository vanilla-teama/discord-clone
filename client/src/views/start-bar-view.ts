import View from '../lib/view';
import { $ } from '../utils/functions';
import ChatsScreenView from './chats-screen-view';
import ScreenView from './screen-view';
import ServersScreenView from './servers-screen-view';

class StartBarView extends View {
  static readonly classes = {
    chatsBar: 'start-bar__chats-bar',
    serversBar: 'start-bar__servers-bar',
  };

  static $chatBar: HTMLDivElement | null;
  static $serversBar: HTMLDivElement | null;

  constructor() {
    const $root = ScreenView.$startBar;

    if (!$root) {
      StartBarView.throwNoRootInTheDomError(`StartBar`);
    }
    super($root);
    StartBarView.$chatBar = null;
    StartBarView.$serversBar = null;
  }
  async build(): Promise<void> {
    StartBarView.$chatBar = $('div', StartBarView.classes.chatsBar);
    StartBarView.$serversBar = $('div', StartBarView.classes.serversBar);
    const $separator = $('div', 'start-bar__separator');
    $separator.textContent = '-------';

    this.$container.append(StartBarView.$chatBar, $separator, StartBarView.$serversBar);
  }
}

export default StartBarView;
