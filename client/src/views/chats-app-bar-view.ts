import View from '../lib/view';
import { Chat } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ChatsAppBarView extends View {
  static readonly classNames = {};

  chat: Chat | null;

  constructor(chat: Chat | null) {
    const $root = MainView.$appbar;
    if (!$root) {
      ChatsAppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
    this.chat = chat;
  }
  build(): void {
    const $container = $('div', 'main');
    if (this.chat) {
      this.$container.append('I AM CHATS APP-BAR!');
    } else {
      this.$container.append('NO CHAT FOR APPBAR!');
    }
  }
}

export default ChatsAppBarView;
