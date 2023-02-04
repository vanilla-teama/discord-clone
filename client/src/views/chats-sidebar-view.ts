import View from '../lib/view';
import { Chat, User } from '../types/entities';
import { $ } from '../utils/functions';
import ChatsScreenView from './chats-screen-view';

class ChatsSideBarView extends View {
  constructor() {
    const $root = ChatsScreenView.$chatsSideBar;
    if (!$root) {
      ChatsSideBarView.throwNoRootInTheDomError(`ServersBar`);
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
    console.log({ chats });
    if (this.$chatList) {
      this.$chatList.append(
        ...chats.map(({ userName }) => {
          return userName;
        })
      );
    }
  }
}

export default ChatsSideBarView;
