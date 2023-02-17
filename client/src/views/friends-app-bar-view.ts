import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';

class FriendsAppBarView extends View {
  constructor() {
    const $root = MainView.$appbar;
    if (!$root) {
      FriendsAppBarView.throwNoRootInTheDomError(`FriendsAppBar`);
    }
    super($root);
  }
  async build(): Promise<void> {
    const $friendsContainer = $('div', 'friends-app-bar__container');
    const $friendsIconsBlock = $('div', 'friends-app-bar__icons-block');
    const $friendsIcon = $('div', 'friends-app-bar__icon');
    const $friendsTitle = $('div', 'friends-app-bar__title');
    $friendsTitle.textContent = 'Friends';

    const $friendsBtnBlock = $('div', 'friends-app-bar__buttons-block');
    const $navFriends = $('button', 'friends-app-bar__friends-btn');
    const $navAddFriend = $('button', 'friends-app-bar__add-btn');

    $navFriends.onclick = this.showFriends;
    $navAddFriend.onclick = this.showAddFriend;

    $navFriends.textContent = 'Friends';
    $navAddFriend.textContent = 'Add Friend';

    $friendsIconsBlock.append($friendsIcon, $friendsTitle);
    $friendsBtnBlock.append($navFriends, $navAddFriend);
    $friendsContainer.append($friendsIconsBlock, $friendsBtnBlock);

    this.$container.append($friendsContainer);
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
