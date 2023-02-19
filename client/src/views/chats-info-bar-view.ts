import moment from '../lib/moment';
import View from '../lib/view';
import { Availability, Chat, Server } from '../types/entities';
import { $ } from '../utils/functions';
import InfoBarView from './info-bar-view';
import MainView from './main-view';
import * as urlEng from '../assets/flags/flag-eng.png';

class ChatsInfoBarView extends View {
  static readonly classNames = {};

  chat: Chat | null;
  $status: HTMLSpanElement;
  $mutualServers: HTMLDivElement;

  constructor(chat: Chat | null) {
    const $root = MainView.$infobar;
    if (!$root) {
      ChatsInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
    this.chat = chat;
    this.$status = $('span', 'chats-info-bar__status');
    this.$mutualServers = $('div', ['chats-info-bar__mutual-server', 'mutual-server']);
  }
  build(): void {
    if (this.chat) {
      InfoBarView.show();
      const $chatsInfoBar = $('div', 'chats-info-bar');

      const $header = $('div', 'chats-info-bar__header');
      const $avatar = $('div', 'chats-info-bar__avatar');
      const $status = this.$status;
      $avatar.append($status);
      $header.append($avatar);

      const $content = $('div', ['chats-info-bar__content', 'content-info']);
      const $userName = $('div', 'content-info__user-name');
      $userName.textContent = `${this.chat.userName}`;
      const $sinceBlock = $('div', 'content-info__since-block');
      const $sinceTitle = $('div', 'content-info__since-title');
      $sinceTitle.textContent = 'Discord Member Since';
      const $sinceDate = $('div', 'content-info__since-date');
      $sinceDate.textContent = moment(this.chat.createdAt).format('MMMM D, YYYY').toUpperCase();
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

      $chatsInfoBar.append($header, $content, this.$mutualServers);
      this.$container.append($chatsInfoBar);
    } else {
      this.$container.append('NO CHAT FOR INFOBAR!');
    }
  }

  displayStatus(availability: Availability): void {
    const getClass = (availability: Availability): string => `chats-info-bar__status_${availability}`;
    if (this.chat) {
      [Availability.Online, Availability.Offline, Availability.Away, Availability.DoNotDisturb].forEach(
        (availability) => this.$status.classList.remove(getClass(availability))
      );
      this.$status.dataset.text = availability;
      this.$status.classList.add(getClass(availability));
      this.chat.availability = availability;
    }
  }

  displayMutualServers(servers: Server[]): void {
    const serversFake: Server[] = [
      {
        name: 'server2',
        image: '/src/assets/icons/discord.svg',
        id: '123',
        owner: { name: 'HAHA', id: '123' },
      },
      {
        name: 'server1',
        image: '',
        id: '456',
        owner: { name: 'HAHA', id: '123' },
      },
    ];

    this.$mutualServers.innerHTML = '';
    this.$mutualServers.style.display = 'flex';
    if (servers.length === 0) {
      this.$mutualServers.style.display = 'none';
      return;
    }
    const count = servers.length;

    const $mutualServerContainer = $('div', 'mutual-server__container');
    const $mutualServerTitle = $('div', 'mutual-server__title');
    $mutualServerTitle.textContent = count === 1 ? `${count} Mutual Server` : `${count} Mutual Servers`;
    const $mutualServerArrow = $('div', 'mutual-server__arrow');
    const $mutualServerList = $('ul', 'mutual-server__list');
    
    servers.forEach(({ id, name, image }) => {
      const $mutualServerItem = $('li', 'mutual-server__item');
      const $mutualServerIcon = Object.assign($('img', 'mutual-server__icon'), { src: image });
      const $mutualServerName = $('div', 'mutual-server__name');

      $mutualServerName.textContent = name;

      $mutualServerItem.append($mutualServerIcon, $mutualServerName);
      $mutualServerList.append($mutualServerItem);

      $mutualServerItem.onclick = () => {
        this.onMutualServerClick(id);
      };
    });

    $mutualServerContainer.append($mutualServerTitle, $mutualServerArrow);
    this.$mutualServers.append($mutualServerContainer, $mutualServerList);

    $mutualServerContainer.onclick = () => {
      $mutualServerArrow.classList.toggle('mutual-server__arrow_rotate');
      $mutualServerList.classList.toggle('mutual-server__list_visible');
    };
  }

  onMutualServerClick = (serverId: string): void => {};

  bindOnMutualServerClick = (handler: (serverId: string) => void) => {
    this.onMutualServerClick = handler;
  };
}

export default ChatsInfoBarView;
