import View from '../lib/view';
import { Chat } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ChatsInfoBarView extends View {
  static readonly classNames = {};

  chat: Chat | null;

  constructor(chat: Chat | null) {
    const $root = MainView.$infobar;
    if (!$root) {
      ChatsInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
    this.chat = chat;
  }
  build(): void {
    const $container = $('div', 'main');

    if (this.chat) {
      this.$container.append('I AM CHATS INFO-BAR!');
    } else {
      this.$container.append('NO CHAT FOR INFOBAR!');
    }
  }
}

export default ChatsInfoBarView;
