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
    const $chatsContainer = $('div', 'chats-sidebar__container');

    const $directMessagesContainer = $('div', 'chats-sidebar__dm-container');
    const $directMessagesTitle = $('div', 'chats-sidebar__dm-title');
    $directMessagesTitle.textContent = 'Direct messages';
    const $directMessagesAddBtn = $('span', 'chats-sidebar__dm-add');
    $directMessagesAddBtn.dataset.name = 'Create DM';

    $directMessagesContainer.append($directMessagesTitle, $directMessagesAddBtn);

    this.$chatList = $('ul', 'chats-sidebar__list');

    const $chatsUser = $('div', 'chats-sidebar__user');
    const $userContainer = $('div', 'chats-sidebar__user-container');
    const $userIcon = $('div', 'chats-sidebar__user-icon');
    const $userName = $('div', 'chats-sidebar__user-name');
    $userName.textContent = 'Oleksandr Kiroi';
    const $userSettings = $('span', 'chats-sidebar__user-settings');
    $userContainer.append($userIcon, $userName);
    $chatsUser.append($userContainer, $userSettings);

    $chatsContainer.append($directMessagesContainer, this.$chatList, $chatsUser);
    this.$container.append($chatsContainer);
  }

  displayChats(chats: Chat[]) {
    if (this.$chatList) {
      this.$chatList.append(
        ...chats.map(({ userId, userName }) => {
          const $item = $('li', 'chats-sidebar__item');
          const $itemBox = $('div', 'chats-sidebar__item-box');
          const $itemIcon = $('div', 'chats-sidebar__icon');
          const $itemName = $('div', 'chats-sidebar__name');
          const $itemClose = $('span', 'chats-sidebar__close');
          $itemName.textContent = `${userName}`;
          $itemBox.append($itemIcon, $itemName);
          $item.append($itemBox, $itemClose);
          return $item;
        })
      );
    }
  }
}

export default ChatsSideBarView;
