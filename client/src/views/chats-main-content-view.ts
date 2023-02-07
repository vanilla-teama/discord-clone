import View from '../lib/view';
import { Chat, MongoObjectId } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';

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

    if (this.chat) {
      $container.append(this.$messageList, this.$chatInput);
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
    this.$messageList.innerHTML = '';

    messages.forEach((message) => {
      this.$messageList.append(this.createMessageItem(message));
    });
  };

  createMessageItem({ username, message, date }: RenderedPersonalMessage): HTMLLIElement {
    const $item = $('li', ['chat__messages-list-item', 'personal-message']);
    const $info = $('div', 'personal-message__info');
    const $message = $('p', 'personal-message__message');

    $info.textContent = `${username} | ${date}`;
    $message.textContent = message;

    $item.append($info, $message);

    return $item;
  }

  private resetInput() {
    this.$chatInput.value = '';
  }
}

export default ChatsMainContentView;
