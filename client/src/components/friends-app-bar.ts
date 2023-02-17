import Controller from '../lib/controller';
import Router from '../lib/router';
import FriendsAppBarView from '../views/friends-app-bar-view';
import FriendsMainContentComponent from './friends-main-content';

class FriendsAppBarComponent extends Controller<FriendsAppBarView> {
  constructor() {
    super(new FriendsAppBarView());
  }

  async init(): Promise<void> {
    this.view.bindShowAddFriend(this.showAddFriend);
    this.view.bindShowFriends(this.showFriends);
    this.view.render();
  }

  showFriends = async (): Promise<void> => {
    FriendsMainContentComponent.showFriendsContent();
  };

  showAddFriend = async (): Promise<void> => {
    FriendsMainContentComponent.showAddFriendContent();
  };
}

export default FriendsAppBarComponent;
