import View from '../lib/view';
import { Chat } from '../types/entities';
import { $ } from '../utils/functions';
import ScreenView from './screen-view';

class ChatsSideBarView extends View {
  constructor() {
    const $root = ScreenView.$sideBar;
    if (!$root) {
      ChatsSideBarView.throwNoRootInTheDomError(`Chats-sidebar`);
    }
    super($root);
  }

  $chatList: HTMLUListElement | null = null;

  build(): void {
    const $chatsContainer = $('div', 'chats-container');
    this.$chatList = $('ul', 'chats-list');
    $chatsContainer.append(this.$chatList);
    this.$container.append($chatsContainer);
  }

  displayChats(chats: Chat[]) {
    if (this.$chatList) {
      this.$chatList.append(
        ...chats.map(({ userId, userName }) => {
          const $item = $('li', 'chats-list-item');
          $item.textContent = userName;
          return $item;
        })
      );
    }
  }
}

export default ChatsSideBarView;
