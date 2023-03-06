import View from '../lib/view';
import { Availability, User } from '../types/entities';
import { $, base64Url } from '../utils/functions';
import MainView from './main-view';
import * as discord from '../assets/icons/discord.svg';
import { translation } from '../utils/lang';

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
    const __ = translation();
    const $container = $('div', 'friends');

    const $friendsContent = $('div', 'friends__friends');
    const $addFriendContent = $('div', 'friends__add-friend');

    FriendsMainContentView.$friendsContent = $friendsContent;
    FriendsMainContentView.$addFriendContent = $addFriendContent;

    const $addFriendContainer = $('div', 'friends__add-friend-container');
    const $addFriendTitle = $('div', 'friends__add-friend-title');

    const $searchInput = this.$searchInput;
    $searchInput.placeholder = __.friends.searchPlaceholder;
    $addFriendTitle.textContent = __.friends.addFriend;

    $addFriendContent.append($searchInput, this.$foundUserList);
    $friendsContent.append(this.$friendList);
    $container.append($friendsContent, $addFriendContent);

    $searchInput.oninput = () => {
      this.onSearch($searchInput.value);
    };

    this.$container.append($container);
  }

  displayFoundUsers(users: User[], currentUser: User): void {
    const __ = translation();

    this.$foundUserList.innerHTML = '';
    if (users.length > 0) {
      users.forEach((user) => {
        this.$foundUserList.append(this.createFoundUserListItem(user, currentUser));
      });
    } else {
      const $item = $('li', 'friends__found-user-list-item');
      const $notFound = $('p');
      $notFound.textContent = __.friends.notFound;
      $item.append($notFound);
      this.$foundUserList.append($item);
    }
  }

  displayFriends(invitedTo: User[], invitedFrom: User[], friends: User[]): void {
    const __ = translation();
    this.$friendList.innerHTML = '';
    if (friends.length > 0 || invitedTo.length > 0 || invitedFrom.length > 0) {
      friends.forEach((user) => {
        this.$friendList.append(this.createFriendItem(user));
      });
      invitedTo.forEach((user) => {
        this.$friendList.append(this.createFriendItem(user, 'invitedTo'));
      });
      invitedFrom.forEach((user) => {
        this.$friendList.append(this.createFriendItem(user, 'invitedFrom'));
      });
    } else {
      const $item = $('li', 'friends__friend-list-item');
      const $notFound = $('p');
      $notFound.textContent = __.friends.noFriends;
      $item.append($notFound);
      this.$friendList.append($item);
    }
  }

  createFriendItem(user: User, status: 'invitedTo' | 'invitedFrom' | 'friend' = 'friend'): HTMLLIElement {
    const __ = translation();
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

    $acceptInvitationButton.textContent = __.common.accept;
    $cancelInvitationButton.textContent = __.common.cancel;

    $status.append(status === 'invitedTo' ? __.common.invited : status === 'invitedFrom' ? __.common.requested : '');

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
    $buttonsBlock.append($massageButtonContainer);
    if (status === 'friend') {
      $buttonsBlock.append($deleteButtonContainer);
    }
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
    const __ = translation();
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
    $inviteButton.textContent = isInvited ? __.common.sent : __.common.invite;
    $inviteButton.disabled = isInvited;

    $inviteButton.onclick = async () => {
      $inviteButton.textContent = `${__.common.sending}...`;
      $inviteButton.disabled = true;
      await this.onInvite(user.id);
      $inviteButton.textContent = __.common.sent;
    };

    return $item;
  }

  resetSearchInputAndFoundList() {
    this.$foundUserList.innerHTML = '';
    this.$searchInput.value = '';
  }

  static showFriendsContent(): void {
    FriendsMainContentView.$addFriendContent?.classList.remove('friends__add-friend_show');
    FriendsMainContentView.$friendsContent?.classList.add('friends__friends_show');
    FriendsMainContentView.onShowFriendsContent();
  }

  static showAddFriendContent(): void {
    FriendsMainContentView.$friendsContent?.classList.remove('friends__friends_show');
    FriendsMainContentView.$addFriendContent?.classList.add('friends__add-friend_show');
    FriendsMainContentView.onShowAddFriendContent();
  }

  static onShowFriendsContent = (): void => {};

  static onShowAddFriendContent = (): void => {};

  onSearch = async (value: string): Promise<void> => {};

  onInvite = async (userId: string): Promise<void> => {};

  onSendMessage = async (userId: string): Promise<void> => {};

  onAcceptInvitation = async (userId: string): Promise<void> => {};

  onCancelInvitation = async (userId: string): Promise<void> => {};

  onDeleteFriend = async (userId: string): Promise<void> => {};

  static bindOnShowFriendsContent = (handler: () => void): void => {
    FriendsMainContentView.onShowFriendsContent = handler;
  };

  static bindOnShowAddFriendContent = (handler: () => void): void => {
    FriendsMainContentView.onShowAddFriendContent = handler;
  };

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
