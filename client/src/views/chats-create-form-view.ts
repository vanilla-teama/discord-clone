import View from '../lib/view';
import { User } from '../types/entities';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';
import PopupView from './popup-view';

class ChatsCreateFormView extends View {
  static readonly classNames = {};

  $form: HTMLFormElement;
  $submit: HTMLButtonElement;
  $friendList: HTMLUListElement;

  constructor($root: HTMLElement) {
    if (!$root) {
      ChatsCreateFormView.throwNoRootInTheDomError('Servers-Create-Form');
    }
    super($root);
    this.$friendList = $('ul', 'form-create-chat__friend-list');
    this.$submit = $('button', 'form-create-chat__submit');
    this.$form = this.createForm();
  }
  build(): void {
    this.$container.append(this.$form);
  }

  private createForm(): HTMLFormElement {
    const __ = translation();
    const $form = $('form', 'form-create-chat');
    const $header = $('h3', 'form-create-chat__title');
    const $submit = this.$submit;
    $submit.textContent = __.sidebar.createDM;
    $submit.type = 'submit';
    $header.textContent = __.sidebar.selectFriends;
    $form.append($header, this.$friendList, $submit);

    return $form;
  }

  private createFriendListItem(friend: User): HTMLLIElement {
    const $item = $('li', 'form-create-chat__friend-list-item');
    const $label = $('label', 'form-create-chat__label');

    const $checkbox = $('input', 'form-create-chat__friend-list-checkbox');
    $checkbox.type = 'checkbox';
    $checkbox.name = 'friendId';
    $checkbox.value = friend.id;

    const $customCheckbox = $('span', 'form-create-chat__custom-checkbox');

    const $itemBox = $('div', 'user-item__box');
    const $itemAvatar = $('div', 'user-item__avatar');
    const $itemIcon = $('div', 'user-item__icon');
    const $itemStatus = $('div', 'user-item__status');
    const $itemName = $('div', 'user-item__name');
    $itemName.textContent = `${friend.name}`;

    $itemAvatar.append($itemIcon, $itemStatus);
    $itemBox.append($itemAvatar, $itemName);
    $label.append($checkbox, $itemBox, $customCheckbox);
    $item.append($label);

    $checkbox.onchange = () => {
      [...($checkbox.closest('form')?.elements || [])].forEach(($elem) => {
        if ($elem instanceof HTMLInputElement && $elem !== $checkbox) {
          $elem.checked = false;
        }
      });
    };

    return $item;
  }

  createNoFriendsMessage() {
    const __ = translation();
    const $message = $('p', 'form-create-chat__no-friends');
    const $friendsButton = $('button', 'form-create-chat__to-friends-btn');
    $message.innerHTML = `${__.sidebar.noFriendsMessageOne}<br/>${__.sidebar.noFriendsMessageTwo} `;
    $message.append($friendsButton);

    $friendsButton.textContent = __.common.here;

    $friendsButton.onclick = this.onNavigateToFriends;

    return $message;
  }

  displayFriends(friends: User[]): void {
    this.$friendList.innerHTML = '';
    if (friends.length > 0) {
      friends.forEach((friend) => {
        this.$friendList.append(this.createFriendListItem(friend));
      });
      this.$submit.style.display = 'block';
    } else {
      this.$friendList.append(this.createNoFriendsMessage());
      this.$submit.style.display = 'none';
    }
  }

  bindFormSubmit(handler: (data: FormData) => Promise<void>): void {
    this.$form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(this.$form);
      await handler(formData);
      PopupView.hide();
    });
  }

  onNavigateToFriends = (): void => {};

  bindOnNavigateToFriends = (handler: () => void): void => {
    this.onNavigateToFriends = handler;
  };
}

export default ChatsCreateFormView;
