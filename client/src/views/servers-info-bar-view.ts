import View from '../lib/view';
import { Availability, ServerOwner, User } from '../types/entities';
import { $, base64Url, capitalize, getAvailability } from '../utils/functions';
import MainView from './main-view';
import * as discord from '../assets/icons/discord.svg';
import { translation } from '../utils/lang';

class ServersInfoBarView extends View {
  static readonly classes = {
    userItem: 'servers-info-bar__item',
    userItemActive: 'servers-info-bar__item_active',
  };

  $membersListOnline: HTMLUListElement;
  $membersListOffline: HTMLUListElement;

  $membersListOnlineHeading: HTMLDivElement;
  $membersListOfflineHeading: HTMLDivElement;

  constructor() {
    const $root = MainView.$infobar;
    if (!$root) {
      ServersInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
    this.$membersListOnline = $('ul', 'servers-info-bar__list-online');
    this.$membersListOffline = $('ul', 'servers-info-bar__list-offline');
    this.$membersListOnlineHeading = $('div', 'servers-info-bar__heading');
    this.$membersListOfflineHeading = $('div', 'servers-info-bar__heading');
  }
  build(): void {
    // const chats: Chat[] = [
    //   {
    //     id: '63dd3dd9938e35dad6409e12',
    //     userId: '63dd3d9da1340145e9b74055',
    //     userName: 'Hlib Hodovaniuk',
    //     availability: Availability.Online,
    //     createdAt: '',
    //   },
    //   {
    //     id: '63dd3d9da1340145e9b74055',
    //     userId: '63dd3dd9938e35dad6409e12',
    //     userName: 'Alexander Chornyi',
    //     availability: Availability.Offline,
    //     createdAt: '',
    //   },
    //   {
    //     id: '63dd3de6938e35dad6409e14',
    //     userId: '63dd3de6938e35dad6409e14',
    //     userName: 'Alexander Kiroi',
    //     availability: Availability.Offline,
    //     createdAt: '',
    //   },
    // ];

    // const $serversInfoBar = $('div', 'servers-info-bar');
    // const $membersOnline = $('div', 'servers-info-bar__members-online');
    // const $membersOffline = $('div', 'servers-info-bar__members-offline');

    // const countItem = (status: string) => chats.filter((item) => item.availability === status).length;

    // chats.forEach((chat) => {
    //   if (chat.availability === 'online') {
    //     $membersOnline.textContent = `Online - ${countItem('online')}`;
    //     const $item = this.createChatItem(chat);
    //     $item.classList.add(ServersInfoBarView.classes.userItemActive);
    //     this.$membersListOnline.append($item);
    //     $membersOnline.append(this.$membersListOnline);
    //   }
    //   if (chat.availability === 'offline') {
    //     $membersOffline.textContent = `Offline - ${countItem('offline')}`;
    //     const $item = this.createChatItem(chat);
    //     this.$membersListOffline.append($item);
    //     $membersOffline.append(this.$membersListOffline);
    //   }
    // });
    const $serversInfoBar = $('div', 'servers-info-bar');
    const $membersOnline = $('div', 'servers-info-bar__members-online');
    const $membersOffline = $('div', 'servers-info-bar__members-offline');

    $membersOnline.append(this.$membersListOnlineHeading, this.$membersListOnline);
    $membersOffline.append(this.$membersListOfflineHeading, this.$membersListOffline);

    $serversInfoBar.append($membersOnline, $membersOffline);
    this.$container.append($serversInfoBar);
  }

  private createChatItem({ name, availability, profile }: User, isOwner: boolean): HTMLLIElement {
    const __ = translation();
    const $item = $('li', ServersInfoBarView.classes.userItem);
    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('img', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${availability}`]);
    const $itemName = $('div', 'user-item__name');
    $itemName.textContent = `${name}`;
    const $iconCrown = $('div', ['servers-info-bar__icon-crown', 'tooltip']);
    $iconCrown.dataset.text = __.common.serverOwner;

    $itemIcon.src = profile?.avatar ? base64Url(profile.avatar) : discord.default;

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName);
    if (isOwner) {
      $itemBox.append($iconCrown);
    }
    $item.append($itemBox);

    return $item;
  }

  displayMembers(members: User[], owner: ServerOwner | null) {
    // Sort members so that the server owner goes first
    let sortedMembers = members;
    if (owner) {
      sortedMembers = sortedMembers.sort((a) => (a.id === owner.id ? -1 : 1));
    }
    const onlineCount = members.filter((user) => user.availability === Availability.Online).length;
    const offlineCount = members.filter((user) => user.availability === Availability.Offline).length;

    this.$membersListOnlineHeading.innerHTML = '';
    this.$membersListOfflineHeading.innerHTML = '';
    this.$membersListOnline.innerHTML = '';
    this.$membersListOffline.innerHTML = '';

    if (onlineCount > 0) {
      this.$membersListOnlineHeading.textContent = `${capitalize(
        getAvailability(Availability.Online)
      )} - ${onlineCount}`;
    }
    if (offlineCount > 0) {
      this.$membersListOfflineHeading.textContent = `${capitalize(
        getAvailability(Availability.Offline)
      )} - ${offlineCount}`;
    }

    members.forEach((user) => {
      if (user.availability === Availability.Online) {
        const $item = this.createChatItem(user, user.id === owner?.id);
        $item.classList.add(ServersInfoBarView.classes.userItemActive);
        this.$membersListOnline.append($item);
      }
      if (user.availability === Availability.Offline) {
        const $item = this.createChatItem(user, user.id === owner?.id);
        this.$membersListOffline.append($item);
      }
    });
  }
}

export default ServersInfoBarView;
