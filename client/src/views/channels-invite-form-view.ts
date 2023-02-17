import View from '../lib/view';
import { User } from '../types/entities';
import { $ } from '../utils/functions';
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
    this.$title = $('h3', ['form__title', 'form-invite-to-server__title']);
    this.$subtitle = $('h4', ['form__title', 'form-invite-to-server__subtitle']);
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
    const $form = Object.assign($('div', ['form-invite-to-server', 'form', 'form_white']), {
      enctype: 'multipart/form-data',
    });
    const $closeBtn = $('button', ['form-invite-to-server__close-btn']);

    this.$title.textContent = 'No Server';
    this.$subtitle.textContent = 'No Channel';

    $form.append($closeBtn, this.$title, this.$subtitle, this.$friendList);

    return $form;
  }

  displayTitle(serverName: string, channelName: string) {
    this.$title.textContent = `Invite friends to ${serverName}`;
    this.$subtitle.textContent = `#${channelName}`;
  }

  displayFriendList(friends: User[]): void {
    this.$friendList.innerHTML = '';
    friends.forEach((friend) => {
      this.$friendList.append(this.createFriendItem(friend));
    });
  }

  createFriendItem(friend: User): HTMLLIElement {
    const $item = $('li', 'form-invite-to-server__friend-list-item');
    const $friendName = $('span', 'form-invite-to-server__friend-lilst-name');
    const $inviteButton = $('button', 'form-invite-to-server__friend-list-invite');

    $friendName.textContent = friend.name;
    $inviteButton.textContent = 'invite';
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
      $button.disabled = true;
      $button.textContent = 'sending...';
      await this.onInvite(userId, () => this.onInviteSuccess($button));
    };
  }

  onInviteSuccess = ($button: HTMLButtonElement): void => {
    $button.textContent = 'sent';
  };
}

export default ChannelsInviteFormView;
