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

  displayFriends(invitedTo: User[], invitedFrom: User[], friends: User[]): void {
    this.$friendList.innerHTML = '';
    friends.forEach((user) => {
      this.$friendList.append(this.createFriendItem(user));
    });
    invitedTo.forEach((user) => {
      this.$friendList.append(this.createFriendItem(user, 'invitedTo'));
    });
    invitedFrom.forEach((user) => {
      this.$friendList.append(this.createFriendItem(user, 'invitedFrom'));
    });
  }

  createFriendItem(user: User, status: 'invitedTo' | 'invitedFrom' | 'friend' = 'friend'): HTMLLIElement {
    const $item = $('li', 'friends__friend-list-item');
    const $messageButton = $('button', 'friends__friend-list-item-message-btn');
    const $deleteFriendButton = $('button', 'friends__friend-list-item-delete-friend-btn');
    const $acceptInvitationButton = $('button', 'friends__friend-list-item-accept-invitation-btn');
    const $cancelInvitationButton = $('button', 'friends__friend-list-item-cancel-invite-btn');

    $messageButton.textContent = 'message';
    $deleteFriendButton.textContent = 'delete';
    $acceptInvitationButton.textContent = 'accept';
    $cancelInvitationButton.textContent = 'cancel';

    $item.append(
      user.name,
      ' | ',
      status === 'invitedTo' ? 'invited' : status === 'invitedFrom' ? 'requested' : '',
      ' | ',
      $messageButton
    );

    if (status === 'invitedFrom') {
      $item.append($acceptInvitationButton);
    } else if (status === 'invitedTo') {
      $item.append($cancelInvitationButton);
    } else if (status === 'friend') {
      $item.append($deleteFriendButton);
    }

    $messageButton.onclick = () => {
      this.onSendMessage(user.id);
    };

    $acceptInvitationButton.onclick = () => {
      this.onAcceptInvitation(user.id);
    };

    $cancelInvitationButton.onclick = () => {
      this.onCancelInvitation(user.id);
    };

    $deleteFriendButton.onclick = () => {
      this.onDeleteFriend(user.id);
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

  onAcceptInvitation = async (userId: string): Promise<void> => {};

  onCancelInvitation = async (userId: string): Promise<void> => {};

  onDeleteFriend = async (userId: string): Promise<void> => {};

  bindOnSearch = (handler: (value: string) => Promise<void>): void => {
    this.onSearch = handler;
  };

  bindOnInvite = (handler: (userId: string) => Promise<void>): void => {
    this.onInvite = handler;
  };

  bindOnSendMessage = (handler: (userId: string) => Promise<void>) => {
    this.onSendMessage = handler;
  };

  bindOnAcceptInvitation = (handler: (userId: string) => Promise<void>) => {
    this.onAcceptInvitation = handler;
  };

  bindOnCancelInvitation = (handler: (userId: string) => Promise<void>) => {
    this.onCancelInvitation = handler;
  };

  bindOnDeleteFriend = (handler: (userId: string) => Promise<void>) => {
    this.onDeleteFriend = handler;
  };
}

export default FriendsMainContentView;
