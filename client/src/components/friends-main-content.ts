import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import FriendsMainContentView from '../views/friends-main-content-view';

class FriendsMainContentComponent extends Controller<FriendsMainContentView> {
  constructor() {
    super(new FriendsMainContentView());
  }

  async init(): Promise<void> {
    this.view.bindOnSearch(this.onSearch);
    this.view.bindOnInvite(this.onInvite);
    this.view.render();
  }

  static showFriendsContent = (): void => {
    FriendsMainContentView.showFriendsContent();
  };

  static showAddFriendContent = (): void => {
    FriendsMainContentView.showAddFriendContent();
  };

  onSearch = async (value: string) => {
    if (!appStore.user) {
      return;
    }
    const userId = appStore.user.id;
    const users = ((await appStore.searchUsers(value)) || []).filter(({ id }) => userId !== id);
    this.view.displayFoundUsers(users, appStore.user);
  };

  onInvite = async (userId: string) => {
    if (!appStore.user) {
      return;
    }
    await appStore.updateUser(appStore.user.id, { invites: [userId] });
    console.log(appStore.users);
  };
}

export default FriendsMainContentComponent;
