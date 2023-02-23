import View from '../lib/view';
import { Availability, User } from '../types/entities';
import { $, base64Url } from '../utils/functions';
import MainView from './main-view';
import * as discord from '../assets/icons/discord.svg';

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

    const $addFriendContainer = $('div', 'friends__add-friend-container');
    const $addFriendTitle = $('div', 'friends__add-friend-title');

    const $searchInput = this.$searchInput;
    $searchInput.placeholder = 'Search by e-mail or name';
    $addFriendTitle.textContent = 'ADD FRIENDS';

    $addFriendContent.append($searchInput, this.$foundUserList);
    $friendsContent.append(this.$friendList);
    $container.append($friendsContent, $addFriendContent);

    $searchInput.oninput = () => {
      this.onSearch($searchInput.value);
    };

    this.$container.append($container);
  }

  displayFoundUsers(users: User[], currentUser: User): void {
    //const userfake = [
    //  {
    //    name: 'stggggggggggggggggggggggggggggggggggggring',
    //    password: 'string',
    //    email: 'string',
    //    phone: 'string',
    //    availability: Availability.Offline,
    //    chats: null,
    //    friends: ['22'],
    //    invitesFrom: ['22'],
    //    invitesTo: ['22'],
    //    invitesToChannels:['dewd'],
    //    createdAt: 'string',
    //    profile: ['ss'],
    //  },
    //  {
    //    name: 'string',
    //    password: 'string',
    //    email: 'string',
    //    phone: 'string',
    //    availability: Availability.Offline,
    //    chats: null,
    //    friends: ['22'],
    //    invitesFrom: ['22'],
    //    invitesTo: ['22'],
    //    invitesToChannels:['dewd'],
    //    createdAt: 'string',
    //    profile: ['ss'],
    //  },
    //];

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

    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('img', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${user.availability}`]);
    const $itemName = $('div', 'user-item__name');
    $itemName.textContent = `${user.name}`;

    $itemIcon.src = user.profile?.avatar ? base64Url(user.profile.avatar) : discord.default;

    const $buttonsBlock = $('div', 'friends__buttons-block');
    const $massageButtonContainer = $('div', 'friends__message-btn-container');
    const $messageButton = $('button', 'friends__message-btn');
    const $deleteButtonContainer = $('div', 'friends__delete-friend-btn-container');
    const $deleteFriendButton = $('button', 'friends__delete-friend-btn');
    const $acceptInvitationButton = $('button', 'friends__accept-invitation-btn');
    const $cancelInvitationButton = $('button', 'friends__cancel-invite-btn');

    const $status = $('div', 'friends__status');
    const $btnContainer = $('div', 'friends__btn-accept-cancel-container');

    $acceptInvitationButton.textContent = 'accept';
    $cancelInvitationButton.textContent = 'cancel';

    $status.append(status === 'invitedTo' ? 'invited' : status === 'invitedFrom' ? 'requested' : '');

    if (status === 'invitedFrom') {
      $btnContainer.append($acceptInvitationButton);
    } else if (status === 'invitedTo') {
      $btnContainer.append($cancelInvitationButton);
    }

    $itemAvatar.append($itemIcon, $itemStatus);
    if (status !== 'friend') {
      $itemBox.append($itemAvatar, $itemName, $status, $btnContainer);
    } else {
      $itemBox.append($itemAvatar, $itemName);
    }
    $massageButtonContainer.append($messageButton);
    $deleteButtonContainer.append($deleteFriendButton);
    $buttonsBlock.append($massageButtonContainer, $deleteButtonContainer);
    $item.append($itemBox, $buttonsBlock);

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
    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('img', 'user-item__icon');
    const $itemStatus = $('div', ['user-item__status', `user-item__status_${user.availability}`]);
    const $itemName = $('div', 'user-item__name');
    $itemName.textContent = `${user.name}`;

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName);
    $itemIcon.src = user.profile?.avatar ? base64Url(user.profile.avatar) : discord.default;

    const isInvited = currentUser.invitesTo?.includes(user.id);

    $item.append($itemBox, $inviteButton);
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

  resetSearchInputAndFoundList() {
    this.$foundUserList.innerHTML = '';
    this.$searchInput.value = '';
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
