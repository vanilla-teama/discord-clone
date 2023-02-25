import View from '../lib/view';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';
import MainView from './main-view';

class FriendsAppBarView extends View {
  $navFriends: HTMLButtonElement;
  $navAddFriend: HTMLButtonElement;

  constructor() {
    const $root = MainView.$appbar;
    if (!$root) {
      FriendsAppBarView.throwNoRootInTheDomError(`FriendsAppBar`);
    }
    super($root);
    this.$navFriends = $('button', 'friends-app-bar__friends-btn');
    this.$navAddFriend = $('button', 'friends-app-bar__add-btn');
  }
  async build(): Promise<void> {
    const __ = translation();
    const $friendsContainer = $('div', 'friends-app-bar__container');
    const $friendsIconsBlock = $('div', 'friends-app-bar__icons-block');
    const $friendsIcon = $('div', 'friends-app-bar__icon');
    const $friendsTitle = $('div', 'friends-app-bar__title');
    $friendsTitle.textContent = 'Friends';

    const $friendsBtnBlock = $('div', 'friends-app-bar__buttons-block');
    const $navFriends = this.$navFriends;
    const $navAddFriend = this.$navAddFriend;

    $navFriends.onclick = () => {
      this.showFriends();
    };
    $navAddFriend.onclick = () => {
      this.showAddFriend();
    };

    $navFriends.textContent = __.friends.friends;
    $navAddFriend.textContent = __.friends.addFriend;

    $friendsIconsBlock.append($friendsIcon, $friendsTitle);
    $friendsBtnBlock.append($navFriends, $navAddFriend);
    $friendsContainer.append($friendsIconsBlock, $friendsBtnBlock);

    this.$container.append($friendsContainer);
  }

  setFriendsActive() {
    this.$navAddFriend.classList.remove('friends-app-bar__add-btn_active');
    this.$navFriends.classList.add('friends-app-bar__friends-btn_active');
  }

  setAddFriendActive() {
    this.$navFriends.classList.remove('friends-app-bar__friends-btn_active');
    this.$navAddFriend.classList.add('friends-app-bar__add-btn_active');
  }

  showFriends = async (): Promise<void> => {};
  showAddFriend = async (): Promise<void> => {};

  bindShowFriends = (handler: () => Promise<void>): void => {
    this.showFriends = handler;
  };

  bindShowAddFriend = (handler: () => Promise<void>): void => {
    this.showAddFriend = handler;
  };
}

export default FriendsAppBarView;
