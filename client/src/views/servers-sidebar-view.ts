import Router, { RouteControllers, SettingsParams } from '../lib/router';
import View from '../lib/view';
import { Chat, User } from '../types/entities';
import { $, replaceWith } from '../utils/functions';
import PopupView, { PopupCoords } from './popup-view';
import ScreenView from './screen-view';

class ServersSideBarView extends View {
  static readonly classes = {
    chatItem: 'chats-sidebar__item',
    chatItemActive: 'chats-sidebar__item_active',
  };

  constructor() {
    const $root = ScreenView.$sideBar;
    if (!$root) {
      ServersSideBarView.throwNoRootInTheDomError(`Chats-sidebar`);
    }
    super($root);
    this.$chatList = $('ul', 'chats-sidebar__list');
    this.$userBar = this.createUserBar();
    this.chatListMap = new Map();
    this.$showCreateChat = this.createShowCreateChatElement();
  }

  $chatList: HTMLUListElement;
  $userBar: HTMLDivElement;
  chatListMap: Map<HTMLLIElement, { chat: Chat }>;
  $showCreateChat: HTMLSpanElement;

  build(): void {
    const $chatsContainer = $('div', 'chats-sidebar__container');

    const $directMessagesContainer = $('div', 'chats-sidebar__dm-container');
    const $directMessagesTitle = $('div', 'chats-sidebar__dm-title');
    $directMessagesTitle.textContent = 'Direct messages';

    $directMessagesContainer.append($directMessagesTitle, this.$showCreateChat);

    $chatsContainer.append($directMessagesContainer, this.$chatList, this.$userBar);
    this.$container.append('SERVERS!!!!!!!!!!!!!!!!!!!!!!!!!', $chatsContainer);
  }

  private createShowCreateChatElement(): HTMLSpanElement {
    const $directMessagesAddBtn = $('span', 'chats-sidebar__dm-add');
    $directMessagesAddBtn.dataset.name = 'Create DM';
    return $directMessagesAddBtn;
  }

  displayChats(chats: Chat[]): void {
    this.$chatList.innerHTML = '';
    chats.forEach((chat) => {
      const $item = this.createChatItem(chat);
      this.$chatList.append($item);
      this.onAppendChatItem($item, chat);
    });
  }

  updateChat(chat: Chat): void {
    const $newItem = this.createChatItem(chat);
    for (const [
      $item,
      {
        chat: { userId },
      },
    ] of this.chatListMap) {
      if (userId === chat.userId) {
        $item.replaceWith($newItem);
        this.chatListMap.delete($item);
        break;
      }
    }
    this.onAppendChatItem($newItem, chat);
  }

  displayUser(user: User | null): void {
    this.$userBar = replaceWith(this.$userBar, this.createUserBar(user || undefined));
  }

  bindShowCreateChat(handler: (coords: PopupCoords, $root: HTMLElement) => void): void {
    this.$showCreateChat.onclick = (event) => {
      const coords: PopupCoords = { top: event.pageY, left: event.pageX };
      handler(coords, PopupView.getContainer());
    };
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
    const $userAvatar = $('div', 'user-item__avatar');
    const $userIcon = $('div', 'user-item__icon');
    const $userStatus = $('div', 'user-item__status');
    const $userName = $('div', 'user-item__name');
    //const $userIcon = $('div', 'chats-sidebar__user-icon');
    //const $userName = $('div', 'chats-sidebar__user-name');
    if (user) {
      $userStatus.classList.add(`user-item__status_${user.availability}`);
    }
    $userName.textContent = user ? user.name : 'User is loading...';
    const $userSettings = $('span', 'chats-sidebar__user-settings');
    $userAvatar.append($userIcon, $userStatus);
    $userContainer.append($userAvatar, $userName);
    $userBar.append($userContainer, $userSettings);

    $userSettings.onclick = () => Router.push(RouteControllers.Settings, '', [SettingsParams.Account]);
    return $userBar;
  }

  private createChatItem({ userName, availability }: Chat): HTMLLIElement {
    const $item = $('li', ServersSideBarView.classes.chatItem);
    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('div', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${availability}`]);
    const $itemName = $('div', 'user-item__name');
    const $itemClose = $('span', 'user-item__close');
    $itemName.textContent = `${userName}`;

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName);
    $item.append($itemBox, $itemClose);

    this.bindChatItemClick($item);
    return $item;
  }

  private onAppendChatItem($item: HTMLLIElement, chat: Chat): void {
    this.chatListMap.set($item, { chat });
  }

  toggleActiveStatus(userId: string | undefined) {
    this.chatListMap.forEach((data, $item) => {
      $item.classList.remove(ServersSideBarView.classes.chatItemActive);
      if (data.chat.userId === userId) {
        $item.classList.add(ServersSideBarView.classes.chatItemActive);
      }
    });
  }
}

export default ServersSideBarView;