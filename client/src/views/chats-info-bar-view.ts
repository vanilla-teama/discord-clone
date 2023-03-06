import moment from '../lib/moment';
import View from '../lib/view';
import { Availability, Chat, Server } from '../types/entities';
import { $, base64Url, getAvailability } from '../utils/functions';
import InfoBarView from './info-bar-view';
import MainView from './main-view';
import * as urlEng from '../assets/flags/flag-eng.png';
import * as discord from '../assets/icons/discord.svg';
import { defaultBanner } from './settings-profiles-view';
import { translation } from '../utils/lang';

class ChatsInfoBarView extends View {
  static readonly classNames = {};

  chat: Chat | null;
  $username: HTMLDivElement;
  $status: HTMLSpanElement;
  $avatar: HTMLImageElement;
  $banner: HTMLDivElement;
  $about: HTMLTextAreaElement;
  $aboutContainer: HTMLDivElement;
  $mutualServers: HTMLDivElement;

  constructor(chat: Chat | null) {
    const $root = MainView.$infobar;
    if (!$root) {
      ChatsInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
    this.chat = chat;
    this.$username = $('div', 'content-info__user-name');
    this.$status = $('span', 'chats-info-bar__status');
    this.$avatar = $('img', 'chats-info-bar__avatar');
    this.$banner = $('div', 'chats-info-bar__header');
    this.$about = $('textarea', 'content-info__note-input');
    this.$aboutContainer = $('div', 'content-info__note-block');
    this.$mutualServers = $('div', ['chats-info-bar__mutual-server', 'mutual-server']);
  }
  build(): void {
    const __ = translation();
    if (this.chat) {
      InfoBarView.show();
      const $chatsInfoBar = $('div', 'chats-info-bar');

      const $header = this.$banner;
      const $avatar = this.$avatar;
      const $status = this.$status;
      $avatar.append($status);
      $header.append($avatar);

      $avatar.src = discord.default;

      const $content = $('div', ['chats-info-bar__content', 'content-info']);
      const $userName = this.$username;
      $userName.textContent = `${this.chat.userName}`;
      const $sinceBlock = $('div', 'content-info__since-block');
      const $sinceTitle = $('div', 'content-info__since-title');
      $sinceTitle.textContent = __.common.discordMemberSince;
      const $sinceDate = $('div', 'content-info__since-date');
      $sinceDate.textContent = moment(this.chat.createdAt).format('MMMM D, YYYY').toUpperCase();
      const $about = this.createAboutContainer();

      $sinceBlock.append($sinceTitle, $sinceDate);
      $content.append($userName, $sinceBlock, $about);

      const $mutualServer = $('div', ['chats-info-bar__mutual-server', 'mutual-server']);
      const $mutualServerContainer = $('div', 'mutual-server__container');
      const $mutualServerTitle = $('div', 'mutual-server__title');
      $mutualServerTitle.textContent = __.common.noMutualServers;
      const $mutualServerArrow = $('div', 'mutual-server__arrow');

      const $mutualServerList = $('ul', 'mutual-server__list');
      // const $mutualServerItem = $('li', 'mutual-server__item');

      $mutualServerContainer.append($mutualServerTitle, $mutualServerArrow);
      // $mutualServerList.append($mutualServerItem);
      $mutualServer.append($mutualServerContainer, $mutualServerList);

      $mutualServerContainer.addEventListener('click', () => {
        $mutualServerArrow.classList.toggle('mutual-server__arrow_rotate');
        $mutualServerList.classList.toggle('mutual-server__list_visible');
      });

      $chatsInfoBar.append($header, $content, this.$mutualServers);
      this.$container.append($chatsInfoBar);
    } else {
      const $notFound = $('div', 'chats-info-bar__not-found');
      $notFound.textContent = __.common.noChat;
      this.$container.append($notFound);
    }
  }

  createAboutContainer(): HTMLDivElement {
    const __ = translation();
    const $aboutBlock = this.$aboutContainer;
    $aboutBlock.innerHTML = '';
    const $noteTitle = $('div', 'content-info__note-title');
    $noteTitle.textContent = __.settings.profile.about;
    const $about = this.$about;

    $aboutBlock.append($noteTitle, $about);
    return $aboutBlock;
  }

  displayUsername(name: string): void {
    this.$username.textContent = name;
  }

  displayAvatar(avatar: string | null): void {
    this.$avatar.src = avatar ? base64Url(avatar) : discord.default;
  }

  displayBanner(banner: string | null): void {
    this.$banner.style.backgroundColor = banner || defaultBanner;
  }

  displayAbout(about: string | null): void {
    if (about) {
      this.$aboutContainer = this.createAboutContainer();
      this.$about.value = about;
    } else {
      this.$aboutContainer.innerHTML = '';
    }
  }

  displayStatus(availability: Availability): void {
    const getClass = (availability: Availability): string => `chats-info-bar__status_${availability}`;
    if (this.chat) {
      [Availability.Online, Availability.Offline, Availability.Away, Availability.DoNotDisturb].forEach(
        (availability) => this.$status.classList.remove(getClass(availability))
      );
      this.$status.dataset.text = getAvailability(availability);
      this.$status.classList.add(getClass(availability));
      this.chat.availability = availability;
    }
  }

  displayMutualServers(servers: Server[]): void {
    const __ = translation();
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
    $mutualServerTitle.textContent =
      count === 1 ? `${count} ${__.common.xMutualServer}` : `${count} ${__.common.xMutualServers}`;
    const $mutualServerArrow = $('div', 'mutual-server__arrow');
    const $mutualServerList = $('ul', 'mutual-server__list');

    servers.forEach(({ id, name, image }) => {
      const $mutualServerItem = $('li', 'mutual-server__item');
      const $mutualServerIcon = $('img', 'mutual-server__icon');
      const $mutualServerName = $('div', 'mutual-server__name');
      $mutualServerName.textContent = name;
      $mutualServerIcon.dataset.name = name.slice(0, 1).toUpperCase();
      $mutualServerIcon.alt = name;

      if (image) {
        $mutualServerIcon.src = base64Url(image);
      }

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
