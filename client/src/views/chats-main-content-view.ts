import View from '../lib/view';
import { Chat, MongoObjectId } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';
import * as userIcon from '../assets/icons/discord.svg';

export type RenderedPersonalMessage = {
  id: MongoObjectId;
  username: string;
  date: string;
  message: string;
};

class ChatsMainContentView extends View {
  static readonly classNames = {};

  get messageText() {
    return this.$chatInput.value;
  }
  chat: Chat | null;
  $chatInput: HTMLInputElement;
  $messageList: HTMLUListElement;
  messagesRecord: Record<string, HTMLLIElement> = {};

  constructor(chat: Chat | null) {
    const $root = MainView.$mainContent;
    if (!$root) {
      ChatsMainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
    this.chat = chat;
    this.$chatInput = $('input', 'chat__input');
    this.$messageList = $('ul', 'chat__messages-list');
  }

  build(): void {
    const $container = $('div', 'chat');
    const $inputContainer = $('div', 'chat__input-container');

    if (this.chat) {
      //console.log(this.chat.userName);
      //const $header = $('div', 'chat__header');
      //const $userAvatar = $('div', 'chat__user-avatar');
      //const $userIcon = $('img', 'chat__user-icon');
      //const $userName = $('div', 'chat__user-name');
      //const $headerText = $('div', 'chat__header-text');
      //$headerText.textContent = `This is the beginning of your direct message history with ${this.chat.userName}`;
      //const $headerServer = $('div', 'chat__header-server-block');

      const messages: RenderedPersonalMessage[] = [
        {
          id: '01',
          username: 'Hlib Hodovaniuk',
          date: '01/26/2023 9:44 AM',
          message: 'Hello',
        },
        {
          id: '02',
          username: 'Alexander Chornyi',
          date: '01/26/2023 9:45 AM',
          message: 'Hi',
        },
        {
          id: '01',
          username: 'Hlib Hodovaniuk',
          date: '01/26/2023 9:47 AM',
          message: 'How do you do?',
        },
      ];

      messages.forEach((message) => {
        this.$messageList.append(this.createMessageItemFake(message));
      });

      $inputContainer.append(this.$chatInput);
      $container.append(this.$messageList, $inputContainer);
    } else {
      $container.append('CHATS NOT FOUND!!!!!!!!!!!!!');
    }

    this.$container.append($container);
  }

  bindMessageEvent(handler: (messageText: string) => Promise<void>) {
    this.$chatInput.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        await handler(this.messageText);
        this.resetInput();
      }
    });
  }

  displayMessages = (messages: RenderedPersonalMessage[]) => {
    //this.$messageList.innerHTML = '';
    //messages.forEach((message) => {
    //this.$messageList.append(this.createMessageItem(message));
    //});
  };

  createMessageItemFake({ username, message, date }: RenderedPersonalMessage): HTMLLIElement {
    const $item = $('li', ['chat__messages-list-item', 'personal-message']);
    const $userIconBlock = $('div', 'personal-message__icon-block');
    const $userIcon = $('img', 'personal-message__icon');
    $userIcon.src = userIcon.default;

    const $massagesBlock = $('div', 'personal-message__massages-block');
    const $info = $('div', 'personal-message__info');
    const $userName = $('span', 'personal-message__name');
    const $spaceFake = $('span', 'personal-message__space');
    const $messageDate = $('span', 'personal-message__date');
    const $message = $('p', 'personal-message__message');

    $userName.textContent = `${username}`;
    $spaceFake.textContent = 'x';
    $messageDate.textContent = `${date}`;
    $message.textContent = message;

    $userIconBlock.append($userIcon);
    $info.append($userName, $spaceFake, $messageDate);
    $massagesBlock.append($info, $message);
    $item.append($userIconBlock, $massagesBlock);

    return $item;
  }

  //createMessageItem({ username, message, date }: RenderedPersonalMessage): HTMLLIElement {
  //  const $item = $('li', ['chat__messages-list-item', 'personal-message']);
  //  const $info = $('div', 'personal-message__info');
  //  const $message = $('p', 'personal-message__message');

  //  $info.textContent = `${username} | ${date}`;
  //  $message.textContent = message;

  //  $item.append($info, $message);

  //  return $item;
  //}

  private resetInput() {
    this.$chatInput.value = '';
  }
}

export default ChatsMainContentView;
