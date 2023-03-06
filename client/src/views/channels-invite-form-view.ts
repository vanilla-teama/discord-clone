import View from '../lib/view';
import { Availability, User } from '../types/entities';
import { $, capitalize } from '../utils/functions';
import { translation } from '../utils/lang';
import ModalView from './modal-view';

class ChannelsInviteFormView extends View {
  static readonly classNames = {};

  $form: HTMLDivElement;
  $title: HTMLHeadingElement;
  $subtitle: HTMLHeadingElement;
  $friendList: HTMLUListElement;

  constructor() {
    const $root = ModalView.getContainer();
    if (!$root) {
      ChannelsInviteFormView.throwNoRootInTheDomError('Channels-Invote-Form');
    }
    super($root);
    this.$title = $('div', 'form-invite-to-server__title');
    this.$subtitle = $('div', 'form-invite-to-server__subtitle');
    this.$friendList = $('ul', 'form-invite-to-server__friend-list');
    this.$form = this.createForm();
  }
  build(): void {
    this.bindAfterRender(this.afterRender);
    this.$container.append(this.$form);
  }

  afterRender = (): void => {
    ModalView.show();
  };

  private createForm(): HTMLDivElement {
    const __ = translation();
    const $form = Object.assign($('div', 'form-invite-to-server'), {
      enctype: 'multipart/form-data',
    });
    const $closeBtn = $('button', ['form-invite-to-server__close-btn']);

    this.$title.textContent = __.sidebar.inviteFormHeading;
    // this.$subtitle.textContent = '';

    $form.append($closeBtn, this.$title, this.$subtitle, this.$friendList);
    $closeBtn.onclick = (event) => {
      ModalView.hide();
    };
    return $form;
  }

  displayTitle(serverName: string, channelName: string) {
    const __ = translation();
    this.$title.textContent = `${__.sidebar.inviteFormHeading} ${serverName}`;
    this.$subtitle.textContent = `${channelName}`;
  }

  displayFriendList(friends: User[]): void {
    const __ = translation();
    this.$friendList.innerHTML = '';

    //const usersFake: User[] = [
    //  {
    //    name: 'Hlib Hodovaniuk',
    //    password: '1111',
    //    email: 'email1@gmail.com',
    //    phone: 'string',
    //    availability: Availability.Online,
    //    chats: [{}],
    //    friends:  ['2', '3'],
    //    invitesFrom:  ['2', '3'],
    //    invitesTo:  ['2', '3'],
    //    invitesToChannels:  ['2', '3'],
    //    createdAt: 'string',
    //  },
    //  {
    //    name: 'Hlib Hodovaniuk',
    //    password: '1111',
    //    email: 'email1@gmail.com',
    //    phone: 'string',
    //    availability: Availability.Online,
    //    chats: [{}],
    //    friends:  ['2', '3'],
    //    invitesFrom:  ['2', '3'],
    //    invitesTo:  ['2', '3'],
    //    invitesToChannels:  ['2', '3'],
    //    createdAt: 'string',
    //  }
    //  //{
    //  //  id: '1',
    //  //  name: 'Hlib Hodovaniuk',
    //  //  email: 'email1@gmail.com',
    //  //  password: '1111',
    //  //  phone: '+380991234567',
    //  //  availability: Availability.Offline,
    //  //  chats: null,
    //  //  friends: ['2', '3'],
    //  //  invitesFrom: ['2', '3'],
    //  //  invitesTo: ['2', '3'],
    //  //  createdAt: 'dwdw'
    //  //},
    //  //{
    //  //  id: '2',
    //  //  name: 'Oleksandr Kiroi',
    //  //  email: 'email1@gmail.com',
    //  //  password: '1111',
    //  //  phone: '+380991234567',
    //  //  availability: Availability.Online,
    //  //  chats: null,
    //  //  friends: ['2', '3'],
    //  //  invitesFrom: ['2', '3'],
    //  //  invitesTo: ['2', '3'],
    //  //  createdAt: 'dwdw'
    //  //},
    //];

    //usersFake.forEach((friend) => {
    //  this.$friendList.append(this.createFriendItem(friend));
    //});

    if (friends.length === 0) {
      const $message = $('p', 'form-invite-to-server__not-found');
      $message.textContent = __.sidebar.noFriendsToAdd;
      this.$friendList.append($message);
    }
    friends.forEach((friend) => {
      this.$friendList.append(this.createFriendItem(friend));
    });
  }

  createFriendItem(friend: User): HTMLLIElement {
    const __ = translation();
    const $item = $('li', 'form-invite-to-server__friend-list-item');
    const $friendName = $('span', 'form-invite-to-server__friend-list-name');
    const $inviteButton = $('button', 'form-invite-to-server__friend-list-invite');

    $friendName.textContent = friend.name;
    $inviteButton.textContent = __.common.invite;
    $inviteButton.type = 'button';
    $item.append($friendName, $inviteButton);

    this.bindInviteButtonClick($inviteButton, friend.id);

    return $item;
  }

  onInvite = async (userId: string, onSuccess: () => void): Promise<void> => {};

  bindOnInvite = (handler: (userId: string, onSuccess: () => void) => Promise<void>): void => {
    this.onInvite = handler;
  };

  bindInviteButtonClick($button: HTMLButtonElement, userId: string): void {
    $button.onclick = async () => {
      const __ = translation();
      $button.disabled = true;
      $button.textContent = `${__.common.sending}...`;
      await this.onInvite(userId, () => this.onInviteSuccess($button));
    };
  }

  onInviteSuccess = ($button: HTMLButtonElement): void => {
    const __ = translation();
    $button.textContent = __.common.sent;
  };
}

export default ChannelsInviteFormView;
