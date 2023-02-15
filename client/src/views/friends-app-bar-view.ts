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
    const $navFriends = $('button');
    const $navAddFriend = $('button');

    $navFriends.onclick = this.showFriends;
    $navAddFriend.onclick = this.showAddFriend;

    $navFriends.textContent = 'Friends';
    $navAddFriend.textContent = 'Add Friend';

    this.$container.append('Friends', $navFriends, $navAddFriend);
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
