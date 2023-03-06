import Router, { RouteControllers, SettingsParams } from '../lib/router';
import View from '../lib/view';
import { Chat, User } from '../types/entities';
import { $, base64Url, isElementOfCssClass, replaceWith } from '../utils/functions';
import PopupView, { PopupCoords } from './popup-view';
import ScreenView from './screen-view';
import * as discord from '../assets/icons/discord.svg';
import { translation } from '../utils/lang';

export type ChatWithAvatar = Chat & { avatar?: string };

class ChatsSideBarView extends View {
  static readonly classes = {
    chatItem: 'chats-sidebar__item',
    chatItemActive: 'chats-sidebar__item_active',
  };
  constructor() {
    const $root = ScreenView.$sideBar;
    if (!$root) {
      ChatsSideBarView.throwNoRootInTheDomError(`Chats-sidebar`);
    }
    super($root);
    this.$chatList = $('ul', 'chats-sidebar__list');
    this.$friendsContainer = $('div', 'chats-sidebar__friends-container');
    this.$friendsButton = $('button', 'chats-sidebar__to-friends');
    this.$friendsInvites = $('div', 'chats-sidebar__invites');
    this.$userBar = this.createUserBar();
    this.chatListMap = new Map();
    this.$showCreateChat = this.createShowCreateChatElement();
  }

  $chatList: HTMLUListElement;
  $userBar: HTMLDivElement;
  $friendsInvites: HTMLDivElement;
  chatListMap: Map<HTMLLIElement, { chat: Chat }>;
  $showCreateChat: HTMLSpanElement;
  $friendsButton: HTMLButtonElement;
  $friendsContainer: HTMLDivElement;

  build(): void {
    const __ = translation();
    const $chatsContainer = $('div', 'chats-sidebar__container');
    const $friendsContainer = this.$friendsContainer;
    const $friendsIcon = $('div', 'chats-sidebar__friends-icon');

    this.$friendsButton.textContent = __.sidebar.friends;

    $friendsContainer.append($friendsIcon, this.$friendsButton, this.$friendsInvites);

    const $directMessagesContainer = $('div', 'chats-sidebar__dm-container');
    const $directMessagesTitle = $('div', 'chats-sidebar__dm-title');
    $directMessagesTitle.textContent = __.sidebar.personalMessages;

    $directMessagesContainer.append($directMessagesTitle, this.$showCreateChat);

    $chatsContainer.append($friendsContainer, $directMessagesContainer, this.$chatList, this.$userBar);

    $friendsContainer.onclick = this.onFriendsButtonClick;
    this.$container.append($chatsContainer);
  }

  private createShowCreateChatElement(): HTMLSpanElement {
    const __ = translation();
    const $directMessagesAddBtn = $('span', ['chats-sidebar__dm-add', 'tooltip']);
    $directMessagesAddBtn.dataset.text = __.sidebar.createDM;
    return $directMessagesAddBtn;
  }

  displayChats(chats: ChatWithAvatar[]): void {
    this.$chatList.innerHTML = '';
    chats.forEach((chat) => {
      const $item = this.createChatItem(chat);
      this.$chatList.append($item);
      this.onAppendChatItem($item, chat);
    });
  }

  updateChat(chat: ChatWithAvatar): void {
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
    $item.onclick = (event) => {
      if (isElementOfCssClass(event.target, 'user-item__close')) {
        return;
      }
      const data = this.chatListMap.get($item);
      if (!data) {
        return;
      }
      const chat = data.chat;
      Router.push(RouteControllers.Chats, '', [chat.userId]);
    };
  }

  bindCloseButtonClick($button: HTMLSpanElement, $chatItem: HTMLLIElement) {
    $button.onclick = async () => {
      const data = this.chatListMap.get($chatItem);
      if (!data) {
        return;
      }
      await this.onChatDelete(data.chat.userId);
    };
  }

  private createUserBar(user?: User): HTMLDivElement {
    const __ = translation();
    const $userBar = $('div', 'chats-sidebar__user-bar');
    const $userContainer = $('div', 'chats-sidebar__user-container');
    const $userAvatar = $('div', 'user-item__avatar');
    const $userIcon = $('img', 'user-item__icon');
    const $userStatus = $('div', 'user-item__status');
    const $userName = $('div', 'user-item__name');

    if (user) {
      $userStatus.classList.add(`user-item__status_${user.availability}`);
    }
    $userName.textContent = user ? user.name : 'User is loading...';
    $userIcon.src = user?.profile?.avatar ? base64Url(user.profile.avatar) : discord.default;
    const $userSettings = $('span', ['chats-sidebar__user-settings', 'tooltip']);
    $userSettings.dataset.text = __.sidebar.userSettings;
    $userAvatar.append($userIcon, $userStatus);
    $userContainer.append($userAvatar, $userName);
    $userBar.append($userContainer, $userSettings);

    $userSettings.onclick = () => Router.push(RouteControllers.Settings, '', [SettingsParams.Account]);
    return $userBar;
  }

  private createChatItem({ userName, availability, avatar }: ChatWithAvatar): HTMLLIElement {
    const $item = $('li', ChatsSideBarView.classes.chatItem);
    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('img', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${availability}`]);
    const $itemName = $('div', 'user-item__name');
    const $itemClose = $('span', 'user-item__close');
    $itemName.textContent = `${userName}`;

    $itemIcon.src = avatar ? base64Url(avatar) : discord.default;

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName);
    $item.append($itemBox, $itemClose);

    this.bindChatItemClick($item);
    this.bindCloseButtonClick($itemClose, $item);
    return $item;
  }

  private onAppendChatItem($item: HTMLLIElement, chat: Chat): void {
    this.chatListMap.set($item, { chat });
  }

  toggleChatLinksActiveStatus(userId: string | null) {
    this.chatListMap.forEach((data, $item) => {
      $item.classList.remove(ChatsSideBarView.classes.chatItemActive);
      if (data.chat.userId === userId) {
        $item.classList.add(ChatsSideBarView.classes.chatItemActive);
      }
    });
  }

  toggleFriendsLinkActiveStatus(toggle: boolean) {
    this.$friendsContainer.classList.toggle('chats-sidebar__friends-container_active', toggle);
  }

  displayFriendsBlockStatus(invites: number) {
    this.$friendsInvites.textContent = `${invites}`;
  }

  onFriendsButtonClick: EventListener = () => {};

  onChatDelete = async (chatId: string): Promise<void> => {};

  bindOnFriendsButtonClick = (handler: EventListener): void => {
    this.onFriendsButtonClick = handler;
  };

  bindOnChatDelete = (handler: (chatId: string) => Promise<void>): void => {
    this.onChatDelete = handler;
  };
}

export default ChatsSideBarView;
