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
      const $chatsInfoBar = $('div', 'chats-info-bar');

      const $header = $('div', 'chats-info-bar__header');
      const $avatar = $('div', 'chats-info-bar__avatar');
      const $status = $('span', 'chats-info-bar__status');
      $avatar.append($status);
      $header.append($avatar);

      const $content = $('div', ['chats-info-bar__content', 'content-info']);
      const $userName = $('div', 'content-info__user-name');
      $userName.textContent = `${this.chat.userName}`;
      const $sinceBlock = $('div', 'content-info__since-block');
      const $sinceTitle = $('div', 'content-info__since-title');
      $sinceTitle.textContent = 'Discord Member Since';
      const $sinceDate = $('div', 'content-info__since-date');
      $sinceDate.textContent = 'May 30, 2022';
      const $noteBlock = $('div', 'content-info__note-block');
      const $noteTitle = $('div', 'content-info__note-title');
      $noteTitle.textContent = 'Note';
      const $noteInput = $('textarea', 'content-info__note-input');
      $noteInput.placeholder = 'Click to add a note';

      $sinceBlock.append($sinceTitle, $sinceDate);
      $noteBlock.append($noteTitle, $noteInput);
      $content.append($userName, $sinceBlock, $noteBlock);

      const $mutualServer = $('div', ['chats-info-bar__mutual-server', 'mutual-server']);
      const $mutualServerContainer = $('div', 'mutual-server__container');
      const $mutualServerTitle = $('div', 'mutual-server__title');
      $mutualServerTitle.textContent = `1 Mutual Server`;
      const $mutualServerArrow = $('div', 'mutual-server__arrow');

      const $mutualServerList = $('ul', 'mutual-server__list');
      const $mutualServerItem = $('li', 'mutual-server__item');
      $mutualServerItem.textContent = 'SERVER NAME';

      $mutualServerContainer.append($mutualServerTitle, $mutualServerArrow);
      $mutualServerList.append($mutualServerItem);
      $mutualServer.append($mutualServerContainer, $mutualServerList);

      $mutualServerContainer.addEventListener('click', () => {
        $mutualServerArrow.classList.toggle('mutual-server__arrow_rotate');
        $mutualServerList.classList.toggle('mutual-server__list_visible');
      });

      $chatsInfoBar.append($header, $content, $mutualServer);
      this.$container.append($chatsInfoBar);
    } else {
      this.$container.append('NO CHAT FOR INFOBAR!');
    }
  }
}

export default ChatsInfoBarView;
