import Router, { RouteControllers, SettingsParams } from '../lib/router';
import View from '../lib/view';
import { Channel, User } from '../types/entities';
import { $, base64Url, isElementOfCssClass, replaceWith } from '../utils/functions';
import ScreenView from './screen-view';
import * as discord from '../assets/icons/discord.svg';

class ServersSideBarView extends View {
  static readonly classes = {
    channelItem: 'servers-sidebar__item',
    channelItemActive: 'servers-sidebar__item_active',
  };

  constructor() {
    const $root = ScreenView.$sideBar;
    if (!$root) {
      ServersSideBarView.throwNoRootInTheDomError(`Servers-sidebar`);
    }
    super($root);
    this.$createChannelContainer = $('div', 'servers-sidebar__create-container');
    this.$serverList = $('ul', 'servers-sidebar__list');
    this.$userBar = this.createUserBar();
    ServersSideBarView.channelsListMap = new Map();
    this.$showCreateChannel = this.createShowCreateChannel();
  }

  $createChannelContainer: HTMLDivElement;
  $serverList: HTMLUListElement;
  $userBar: HTMLDivElement;
  static channelsListMap: Map<HTMLLIElement, { channel: Channel }>;
  $showCreateChannel: HTMLSpanElement;

  build(): void {
    const $serversContainer = $('div', 'servers-sidebar__container');

    // const $createContainer = $('div', 'servers-sidebar__create-container');
    // const $createTitle = $('div', 'servers-sidebar__create-title');
    // $createTitle.textContent = 'Create channel';

    // $createContainer.append($createTitle, this.$showCreateChannel);

    $serversContainer.append(this.$createChannelContainer, this.$serverList, this.$userBar);
    this.$container.append($serversContainer);
  }

  private createShowCreateChannel(): HTMLSpanElement {
    const $directMessagesAddBtn = $('span', 'servers-sidebar__create-add');
    $directMessagesAddBtn.dataset.name = 'Create channel';
    return $directMessagesAddBtn;
  }

  displayCreateChannelContainer() {
    const $createTitle = $('div', 'servers-sidebar__create-title');
    $createTitle.textContent = 'Create channel';
    this.$createChannelContainer.innerHTML = '';
    this.$createChannelContainer.append($createTitle, this.$showCreateChannel);
  }

  displayChannels(channels: Channel[]): void {
    this.$serverList.innerHTML = '';

    const channelsFake: Channel[] = [
      {
        id: 'efef',
        serverId: '12',
        name: 'RS',
      },
      {
        id: 'efef',
        serverId: '45',
        name: 'SCSS',
      },
    ];

    channels.forEach((channel) => {
      const $item = this.createChannelItem(channel);
      this.$serverList.append($item);
      this.onAppendChannelItem($item, channel);
    });
  }

  displayUser(user: User | null): void {
    this.$userBar = replaceWith(this.$userBar, this.createUserBar(user || undefined));
  }

  bindShowCreateChannel(handler: () => void): void {
    this.$showCreateChannel.onclick = () => {
      handler();
    };
  }

  bindChannelItemClick($item: HTMLLIElement) {
    $item.onclick = (event) => {
      if (isElementOfCssClass(event.target, 'servers-sidebar__invite')) {
        return;
      }
      const data = ServersSideBarView.channelsListMap.get($item);
      if (!data) {
        return;
      }
      const channel = data.channel;
      this.onChannelItemClick(channel.serverId, channel.id);
    };
  }

  bindInviteClick($button: HTMLButtonElement, $item: HTMLLIElement): void {
    $button.onclick = async () => {
      const data = ServersSideBarView.channelsListMap.get($item);
      if (!data) {
        return;
      }
      await this.onInvite(data.channel);
    };
  }

  private createUserBar(user?: User): HTMLDivElement {
    const $userBar = $('div', 'chats-sidebar__user-bar');
    const $userContainer = $('div', 'chats-sidebar__user-container');
    const $userAvatar = $('div', 'user-item__avatar');
    const $userIcon = $('img', 'user-item__icon');
    const $userStatus = $('div', 'user-item__status');
    const $userName = $('div', 'user-item__name');
    //const $userIcon = $('div', 'chats-sidebar__user-icon');
    //const $userName = $('div', 'chats-sidebar__user-name');
    if (user) {
      $userStatus.classList.add(`user-item__status_${user.availability}`);
    }
    $userIcon.src = user?.profile?.avatar ? base64Url(user.profile.avatar) : discord.default;
    $userName.textContent = user ? user.name : 'User is loading...';
    const $userSettings = $('span', 'chats-sidebar__user-settings');
    $userAvatar.append($userIcon, $userStatus);
    $userContainer.append($userAvatar, $userName);
    $userBar.append($userContainer, $userSettings);

    $userSettings.onclick = () => Router.push(RouteControllers.Settings, '', [SettingsParams.Account]);
    return $userBar;
  }

  private createChannelItem({ name }: Channel): HTMLLIElement {
    const $item = $('li', ServersSideBarView.classes.channelItem);
    const $itemIcon = $('div', 'servers-sidebar__hash-icon');
    const $itemName = $('div', 'servers-sidebar__name');
    const $inviteButton = $('button', ['servers-sidebar__invite', 'tooltip']);
    $itemName.textContent = `${name}`;
    $inviteButton.dataset.text = 'Create invite';

    $item.append($itemIcon, $itemName, $inviteButton);

    this.bindChannelItemClick($item);
    this.bindInviteClick($inviteButton, $item);
    return $item;
  }

  private onAppendChannelItem($item: HTMLLIElement, channel: Channel): void {
    ServersSideBarView.channelsListMap.set($item, { channel });
  }

  static toggleActiveStatus(channelId: string | undefined) {
    console.log(channelId);
    ServersSideBarView.channelsListMap.forEach((data, $item) => {
      $item.classList.remove(ServersSideBarView.classes.channelItemActive);
      if (data.channel.id === channelId) {
        $item.classList.add(ServersSideBarView.classes.channelItemActive);
      }
    });
  }

  onChannelItemClick = (serverId: string, channelId: string): void => {};

  onInvite = async (channel: Channel): Promise<void> => {};

  bindOnChannelItemClick = (handler: (serverId: string, channelId: string) => void): void => {
    this.onChannelItemClick = handler;
  };

  bindOnInvite = (handler: (channel: Channel) => Promise<void>): void => {
    this.onInvite = handler;
  };
}

export default ServersSideBarView;
