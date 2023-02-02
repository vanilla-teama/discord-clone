import View from '../lib/view';
import { $ } from '../utils/functions';
import ChatsScreenView from './chats-screen-view';
import ServersScreenView from './servers-screen-view';

class StartBarView extends View {
  static readonly classes = {
    chatsBar: 'start-bar__chats-bar',
    serversBar: 'start-bar__servers-bar',
  };

  static $chatBar: HTMLDivElement | null;
  static $serversBar: HTMLDivElement | null;

  constructor() {
    // This check will be fixed later when develop a General Layout or something like this
    const $root =
      ((ChatsScreenView.$startBar?.isConnected && ChatsScreenView.$startBar) || null) ??
      ((ServersScreenView.$startBar?.isConnected && ServersScreenView.$startBar) || null) ??
      null;

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
    const $separator = $('hr');

    this.$container.append(StartBarView.$chatBar, $separator, StartBarView.$serversBar);
  }
}

export default StartBarView;
