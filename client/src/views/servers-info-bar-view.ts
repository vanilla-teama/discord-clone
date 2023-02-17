import View from '../lib/view';
import { Availability } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';
import { Chat } from './../types/entities';

class ServersInfoBarView extends View {
  static readonly classes = {
    userItem: 'servers-info-bar__item',
    userItemActive: 'servers-info-bar__item_active',
  };

  $membersListOffline: HTMLUListElement;
  $membersListOnline: HTMLUListElement;

  constructor() {
    const $root = MainView.$infobar;
    if (!$root) {
      ServersInfoBarView.throwNoRootInTheDomError('Info-bar');
    }
    super($root);
    this.$membersListOnline = $('ul', 'servers-info-bar__list-online');
    this.$membersListOffline = $('ul', 'servers-info-bar__list-offline');
  }
  build(): void {
    const chats: Chat[] = [
      {
        id: '63dd3dd9938e35dad6409e12',
        userId: '63dd3d9da1340145e9b74055',
        userName: 'Hlib Hodovaniuk',
        availability: Availability.Online,
        createdAt: '',
      },
      {
        id: '63dd3d9da1340145e9b74055',
        userId: '63dd3dd9938e35dad6409e12',
        userName: 'Alexander Chornyi',
        availability: Availability.Offline,
        createdAt: '',
      },
      {
        id: '63dd3de6938e35dad6409e14',
        userId: '63dd3de6938e35dad6409e14',
        userName: 'Alexander Kiroi',
        availability: Availability.Offline,
        createdAt: '',
      },
    ];

    const $serversInfoBar = $('div', 'servers-info-bar');
    const $membersOnline = $('div', 'servers-info-bar__members-online');
    const $membersOffline = $('div', 'servers-info-bar__members-offline');

    const countItem = (status: string) => chats.filter((item) => item.availability === status).length;

    chats.forEach((chat) => {
      if (chat.availability === 'online') {
        $membersOnline.textContent = `Online - ${countItem('online')}`;
        const $item = this.createChatItem(chat);
        $item.classList.add(ServersInfoBarView.classes.userItemActive);
        this.$membersListOnline.append($item);
        $membersOnline.append(this.$membersListOnline);
      }
      if (chat.availability === 'offline') {
        $membersOffline.textContent = `Offline - ${countItem('offline')}`;
        const $item = this.createChatItem(chat);
        this.$membersListOffline.append($item);
        $membersOffline.append(this.$membersListOffline);
      }
    });

    $serversInfoBar.append($membersOnline, $membersOffline);
    this.$container.append($serversInfoBar);
  }

  private createChatItem({ userName, availability }: Chat): HTMLLIElement {
    const $item = $('li', ServersInfoBarView.classes.userItem);
    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('div', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${availability}`]);
    const $itemName = $('div', 'user-item__name');
    $itemName.textContent = `${userName}`;
    const $iconCrown = $('div', ['servers-info-bar__icon-crown', 'tooltip']);
    $iconCrown.dataset.text = 'Server owner';

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName, $iconCrown);
    $item.append($itemBox);

    return $item;
  }
}

export default ServersInfoBarView;
