import View from '../lib/view';
import { User } from '../types/entities';
import { $ } from '../utils/functions';
import PopupView from './popup-view';

class ChatsCreateFormView extends View {
  static readonly classNames = {};

  $form: HTMLFormElement;
  $friendList: HTMLUListElement;

  constructor($root: HTMLElement) {
    if (!$root) {
      ChatsCreateFormView.throwNoRootInTheDomError('Servers-Create-Form');
    }
    super($root);
    this.$friendList = $('ul', 'form-create-chat__friend-list');
    this.$form = this.createForm();
  }
  build(): void {
    this.bindAfterRender(this.afterRender);
    this.$container.append(this.$form);
  }

  afterRender = (): void => {
    // ModalView.show();
  };

  private createForm(): HTMLFormElement {
    const $form = $('form', 'form-create-chat');
    const $header = $('h3', 'form-create-chat__title');
    const $submit = $('button', 'form-create-chat__submit');
    $submit.textContent = 'Create DM';
    $submit.type = 'submit';
    $header.textContent = 'Select Friends';
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

    return $item;
  }

  displayFriends(friends: User[]): void {
    friends.forEach((friend) => {
      this.$friendList.append(this.createFriendListItem(friend));
    });
  }

  bindFormSubmit(handler: (data: FormData) => Promise<void>): void {
    this.$form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(this.$form);
      await handler(formData);
      // PopupView.hide();
    });
  }
}

export default ChatsCreateFormView;
