import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { Chat, User } from '../types/entities';
import { $, isClosestElementOfClass, isElementOfClass, replaceWith } from '../utils/functions';
import ScreenView from './screen-view';

class ChatsSideBarView extends View {
  static readonly classes = {
    chatItem: 'chats-sidebar__item',
  };

  constructor() {
    const $root = ScreenView.$sideBar;
    if (!$root) {
      ChatsSideBarView.throwNoRootInTheDomError(`Chats-sidebar`);
    }
    super($root);
    this.$chatList = $('ul', 'chats-sidebar__list');
    this.$userBar = this.createUserBar();
    this.chatListMap = new Map();
  }

  $chatList: HTMLUListElement;
  $userBar: HTMLDivElement;
  chatListMap: Map<HTMLLIElement, { chat: Chat }>;

  build(): void {
    const $chatsContainer = $('div', 'chats-sidebar__container');

    const $directMessagesContainer = $('div', 'chats-sidebar__dm-container');
    const $directMessagesTitle = $('div', 'chats-sidebar__dm-title');
    $directMessagesTitle.textContent = 'Direct messages';
    const $directMessagesAddBtn = $('span', 'chats-sidebar__dm-add');
    $directMessagesAddBtn.dataset.name = 'Create DM';

    $directMessagesContainer.append($directMessagesTitle, $directMessagesAddBtn);

    $chatsContainer.append($directMessagesContainer, this.$chatList, this.$userBar);
    this.$container.append($chatsContainer);
  }

  displayChats(chats: Chat[]): void {
    chats.forEach((chat) => {
      const $item = this.createChatItem(chat);
      this.$chatList.append($item);
      this.onAppendChatItem($item, chat);
    });
  }

  displayUser(user: User | null): void {
    this.$userBar = replaceWith(this.$userBar, this.createUserBar(user || undefined));
  }

  bindChatItemClick($item: HTMLLIElement) {
    $item.addEventListener('click', () => {
      const data = this.chatListMap.get($item);
      if (!data) {
        return;
      }
      const chat = data.chat;
      Router.push(RouteControllers.Chats, '', [chat.userId]);
    });
  }

  private createUserBar(user?: User): HTMLDivElement {
    const $userBar = $('div', 'chats-sidebar__user-bar');
    const $userContainer = $('div', 'chats-sidebar__user-container');
    const $userIcon = $('div', 'chats-sidebar__user-icon');
    const $userName = $('div', 'chats-sidebar__user-name');
    $userName.textContent = user ? user.name : 'User is loading...';
    const $userSettings = $('span', 'chats-sidebar__user-settings');
    $userContainer.append($userIcon, $userName);
    $userBar.append($userContainer, $userSettings);
    return $userBar;
  }

  private createChatItem({ userName }: Chat): HTMLLIElement {
    const $item = $('li', ChatsSideBarView.classes.chatItem);
    const $itemBox = $('div', 'chats-sidebar__item-box');
    const $itemIcon = $('div', 'chats-sidebar__icon');
    const $itemName = $('div', 'chats-sidebar__name');
    const $itemClose = $('span', 'chats-sidebar__close');
    $itemName.textContent = `${userName}`;
    $itemBox.append($itemIcon, $itemName);
    $item.append($itemBox, $itemClose);

    this.bindChatItemClick($item);
    return $item;
  }

  private onAppendChatItem($item: HTMLLIElement, chat: Chat): void {
    this.chatListMap.set($item, { chat });
  }
}

export default ChatsSideBarView;
