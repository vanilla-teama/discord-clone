import View from '../lib/view';
import { $, isClosestElementOfCssClass } from '../utils/functions';
import MainView from './main-view';
import * as userIcon from '../assets/icons/discord.svg';
import { MongoObjectId } from '../types/entities';

export type RenderedChannelMessage = {
  id: MongoObjectId;
  userId: MongoObjectId;
  username: string;
  date: string;
  message: string;
  responsedToMessage: RenderedChannelMessage | null;
};

class ServersMainContentView extends View {
  static readonly classNames = {};
  $chatInput: HTMLInputElement;
  $replyContainer: HTMLDivElement;
  $messageList: HTMLUListElement;
  $repliedMessage: HTMLLIElement | null;
  messagesMap: Map<
    HTMLLIElement,
    {
      $fastMenu: HTMLDivElement;
      $menu: HTMLDivElement;
      $editFormContainer: HTMLDivElement;
      $messageContent: HTMLElement;
      message: RenderedChannelMessage;
    }
  >;

  get messageText() {
    return this.$chatInput.value;
  }

  constructor() {
    const $root = MainView.$mainContent;
    if (!$root) {
      ServersMainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
    this.$chatInput = $('input', 'servers-chat__input');
    this.$messageList = $('ul', 'servers-chat__messages-list');
    this.$replyContainer = $('div', 'servers-chat__reply-container');
    this.$repliedMessage = null;
    this.messagesMap = new Map();
  }
  build(): void {
    const $container = $('div', 'servers-chat');
    const $inputContainer = $('div', 'servers-chat__input-container');

    const messagesFake: RenderedChannelMessage[] = [
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

    // messagesFake.forEach((message) => {
    //   this.$messageList.append(this.createMessageItem(message));
    // });

    $inputContainer.append(this.$replyContainer, this.$chatInput);
    $container.append(this.$messageList, $inputContainer);

    this.$container.append($container);
  }

  createMessageItem(message_: RenderedChannelMessage): HTMLLIElement {
    const { id, username, message, date, responsedToMessage } = message_;
    const $item = $('li', ['chat__messages-list-item', 'channel-message']);
    const $userIconBlock = $('div', 'channel-message__icon-block');
    const $userIcon = $('img', 'channel-message__icon');
    $userIcon.src = userIcon.default;

    const $userBlock = $('div', 'channel-message__user-block');
    const $messageBlock = $('div', 'channel-message__massages-block');
    const $info = $('div', 'channel-message__info');
    const $userName = $('span', 'channel-message__name');
    const $messageDate = $('span', 'channel-message__date');
    const $message = $('p', 'channel-message__message');
    const $fastMenu = $('div', 'chat__fast-menu');
    const $editFormContainer = $('div', 'channel-message__edit-form-container');
    const $menu = $('div', 'chat__menu');

    $userName.textContent = `${username}`;
    $messageDate.textContent = `${date}`;
    $message.textContent = message;

    $userIconBlock.append($userIcon);
    $info.append($userName, $messageDate);
    $messageBlock.append($info, $message);
    $userBlock.append($userIconBlock, $messageBlock);
    $item.append($userBlock, $editFormContainer, $menu, $fastMenu);
    //$item.append($userIconBlock, $messageBlock, $editFormContainer, $fastMenu, $menu);

    if (responsedToMessage) {
      const $repliedInfo = $('p', 'channel-message__replied-info');
      $repliedInfo.textContent = `${responsedToMessage.username} | ${responsedToMessage.message}`;
      $repliedInfo.dataset.scrollTo = `#channel-message-${responsedToMessage.id}`;
      $messageBlock.prepend($repliedInfo);
    }

    $item.id = `channel-message-${id}`;

    this.messagesMap.set($item, { $fastMenu, $menu, $editFormContainer, $messageContent: $message, message: message_ });

    return $item;
  }

  displayMessages = (messages: RenderedChannelMessage[]) => {
    this.$messageList.innerHTML = '';
    this.messagesMap = new Map();
    messages.forEach((message) => {
      this.$messageList.append(this.createMessageItem(message));
    });
  };

  bindMessageEvent(handler: (messageText: string, responsedToMessageId: string | null) => Promise<void>) {
    this.$chatInput.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        await handler(this.messageText, this.getReplyId() || null);
        this.resetInput();
        if (this.$repliedMessage) {
          this.destroyReply(this.$repliedMessage);
        }
      }
    });
  }

  bindMessageHover = (
    displayFastMenuHandler: (
      $container: HTMLElement,
      $message: HTMLLIElement,
      message: RenderedChannelMessage
    ) => Promise<void>
  ): void => {
    this.$messageList.onmouseover = async (mouseOverEvent) => {
      if (isClosestElementOfCssClass(mouseOverEvent.target, 'channel-message')) {
        const $message = mouseOverEvent.target.closest<HTMLLIElement>('.channel-message');
        if ($message && !$message.classList.contains('channel-message_edit')) {
          const items = this.messagesMap.get($message);
          if (items) {
            await displayFastMenuHandler(items.$fastMenu, $message, items.message);
            mouseOverEvent.target.onmouseleave = () => {
              this.destroyFastMenu();
            };
          }
        }
      }
    };
  };

  bindDestroyFastMenu = (destroyFastMenuHandler: () => void): void => {
    this.destroyFastMenu = destroyFastMenuHandler;
  };

  destroyFastMenu = (): void => {};

  getReplyId(): string | null {
    if (!this.$repliedMessage) {
      return null;
    }
    const items = this.messagesMap.get(this.$repliedMessage);
    if (!items) {
      return null;
    }
    return items.message.id;
  }

  private resetInput() {
    this.$chatInput.value = '';
  }

  destroyReply($message: HTMLLIElement): void {
    this.$repliedMessage = null;
    $message.classList.remove('channel-message_reply');
    this.destroyInputReply();
  }

  destroyInputReply(): void {
    this.$replyContainer.innerHTML = '';
  }
}

export default ServersMainContentView;
