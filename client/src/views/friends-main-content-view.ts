import View from '../lib/view';
import { User } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';

class FriendsMainContentView extends View {
  static readonly classNames = {};

  $searchInput: HTMLInputElement;
  $foundUserList: HTMLUListElement;
  $friendList: HTMLUListElement;
  static $friendsContent: HTMLDivElement;
  static $addFriendContent: HTMLDivElement;

  constructor() {
    const $root = MainView.$mainContent;
    if (!$root) {
      FriendsMainContentView.throwNoRootInTheDomError('Friends-Main-content');
    }
    super($root);
    this.$searchInput = $('input', 'search-users');
    this.$foundUserList = $('ul', 'friends__found-user-list');
    this.$friendList = $('ul', 'friends__friend-list');
  }
  build(): void {
    const $container = $('div', 'friends');

    const $friendsContent = $('div', 'friends__friends');
    const $addFriendContent = $('div', 'friends__add-friend');

    FriendsMainContentView.$friendsContent = $friendsContent;
    FriendsMainContentView.$addFriendContent = $addFriendContent;

    const $searchInput = this.$searchInput;
    $searchInput.placeholder = 'Search by e-mail or name';

    $addFriendContent.append($searchInput, this.$foundUserList);
    $friendsContent.append(this.$friendList);
    $container.append($friendsContent, $addFriendContent);

    $searchInput.oninput = () => {
      this.onSearch($searchInput.value);
    };

    this.$container.append($container);
  }

  displayFoundUsers(users: User[], currentUser: User): void {
    this.$foundUserList.innerHTML = '';
    users.forEach((user) => {
      this.$foundUserList.append(this.createFoundUserListItem(user, currentUser));
    });
  }

  displayFriends(invited: User[], friends: User[]): void {
    this.$friendList.innerHTML = '';
    invited.forEach((user) => {
      this.$friendList.append(this.createFriendItem(user, true));
    });
    friends.forEach((user) => {
      this.$friendList.append(this.createFriendItem(user));
    });
  }

  createFriendItem(user: User, invited = false): HTMLLIElement {
    const $item = $('li', 'friends__friend-list-item');
    const $messageButton = $('button', 'friends__friend-list-item-message-btn');
    const $deleteButton = $('button', 'friends__friend-list-item-delete-btn');

    $messageButton.textContent = 'message';
    $deleteButton.textContent = 'delete';

    $item.append(user.name, ' | ', invited ? 'invited' : '', ' | ', $messageButton, $deleteButton);

    $messageButton.onclick = () => {
      this.onSendMessage(user.id);
    };

    return $item;
  }

  createFoundUserListItem(user: User, currentUser: User): HTMLLIElement {
    const $item = $('li', 'friends__found-user-list-item');
    const $inviteButton = $('button', 'friends__invite-user');

    const isInvited = currentUser.invitesTo?.includes(user.id);

    $item.append(`${user.name}`, $inviteButton);
    $inviteButton.textContent = isInvited ? 'sent' : 'invite';
    $inviteButton.disabled = isInvited;

    $inviteButton.onclick = async () => {
      $inviteButton.textContent = 'sending...';
      $inviteButton.disabled = true;
      await this.onInvite(user.id);
      $inviteButton.textContent = 'sent';
    };

    return $item;
  }

  static showFriendsContent(): void {
    FriendsMainContentView.$addFriendContent.classList.remove('friends__add-friend_show');
    FriendsMainContentView.$friendsContent.classList.add('friends__friends_show');
  }

  static showAddFriendContent(): void {
    FriendsMainContentView.$friendsContent.classList.remove('friends__friends_show');
    FriendsMainContentView.$addFriendContent.classList.add('friends__add-friend_show');
  }

  onSearch = async (value: string): Promise<void> => {};

  onInvite = async (userId: string): Promise<void> => {};

  onSendMessage = async (userId: string): Promise<void> => {};

  bindOnSearch = (handler: (value: string) => Promise<void>): void => {
    this.onSearch = handler;
  };

  bindOnInvite = (handler: (userId: string) => Promise<void>): void => {
    this.onInvite = handler;
  };

  bindOnSendMessage = (handler: (userId: string) => Promise<void>) => {
    this.onSendMessage = handler;
  };
}

export default FriendsMainContentView;
