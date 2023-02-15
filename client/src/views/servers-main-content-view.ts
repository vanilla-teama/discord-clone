import View from '../lib/view';
import { $ } from '../utils/functions';
import { RenderedPersonalMessage } from './chats-main-content-view';
import MainView from './main-view';
import * as userIcon from '../assets/icons/discord.svg';

class ServersMainContentView extends View {
  static readonly classNames = {};
  $chatInput: HTMLInputElement;
  $replyContainer: HTMLDivElement;
  $messageList: HTMLUListElement;

  constructor() {
    const $root = MainView.$mainContent;
    if (!$root) {
      ServersMainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
    this.$chatInput = $('input', 'servers-chat__input');
    this.$messageList = $('ul', 'servers-chat__messages-list');
    this.$replyContainer = $('div', 'servers-chat__reply-container');
  }
  build(): void {
    const $container = $('div', 'servers-chat');
    const $inputContainer = $('div', 'servers-chat__input-container');

    const messagesFake: RenderedPersonalMessage[] = [
      {
        id: '01',
        userId: '03',
        username: 'Hlib Hodovaniuk',
        date: '01/26/2023 9:44 AM',
        message: 'Hello',
        responsedToMessage: null,
      },
      {
        id: '02',
        userId: '03',
        username: 'Alexander Chornyi',
        date: '01/26/2023 9:45 AM',
        message: 'Hi',
        responsedToMessage: null,
      },
      {
        id: '01',
        userId: '03',
        username: 'Hlib Hodovaniuk',
        date: '01/26/2023 9:47 AM',
        message: 'How do you do?',
        responsedToMessage: null,
      },
    ];

    messagesFake.forEach((message) => {
      this.$messageList.append(this.createMessageItem(message));
    });

    $inputContainer.append(this.$replyContainer, this.$chatInput);
    $container.append(this.$messageList, $inputContainer);

    this.$container.append($container);
  }

  createMessageItem(message_: RenderedPersonalMessage): HTMLLIElement {
    const { id, username, message, date, responsedToMessage } = message_;
    const $item = $('li', ['servers-chat__messages-list-item', 'personal-message']);
    const $userIconBlock = $('div', 'personal-message__icon-block');
    const $userIcon = $('img', 'personal-message__icon');
    $userIcon.src = userIcon.default;

    const $messageBlock = $('div', 'personal-message__massages-block');
    const $info = $('div', 'personal-message__info');
    const $userName = $('span', 'personal-message__name');
    const $spaceFake = $('span', 'personal-message__space');
    const $messageDate = $('span', 'personal-message__date');
    const $message = $('p', 'personal-message__message');
    const $fastMenu = $('div', 'chat__fast-menu');
    const $editFormContainer = $('div', 'personal-message__edit-form-container');
    const $menu = $('div', 'chat__menu');

    $userName.textContent = `${username}`;
    $spaceFake.textContent = 'x';
    $messageDate.textContent = `${date}`;
    $message.textContent = message;

    $userIconBlock.append($userIcon);
    $info.append($userName, $spaceFake, $messageDate);
    $messageBlock.append($info, $message);
    $item.append($userIconBlock, $messageBlock, $editFormContainer, $fastMenu, $menu);

    if (responsedToMessage) {
      const $repliedInfo = $('p', 'personal-message__replied-info');
      $repliedInfo.textContent = `${responsedToMessage.username} | ${responsedToMessage.message}`;
      $repliedInfo.dataset.scrollTo = `#personal-message-${responsedToMessage.id}`;
      $messageBlock.prepend($repliedInfo);
    }

    $item.id = `personal-message-${id}`;

    return $item;
  }
}

export default ServersMainContentView;
