import View from '../lib/view';
import { Chat, MongoObjectId, PersonalMessage } from '../types/entities';
import { $, isClosestElementOfCssClass, isElementOfCssClass } from '../utils/functions';
import MainView from './main-view';
import * as userIcon from '../assets/icons/discord.svg';

export type RenderedPersonalMessage = {
  id: MongoObjectId;
  userId: MongoObjectId;
  username: string;
  date: string;
  message: string;
  responsedToMessage: RenderedPersonalMessage | null;
};

class ChatsMainContentView extends View {
  static readonly classNames = {};

  get messageText() {
    return this.$chatInput.value;
  }
  chat: Chat | null;
  $chatInput: HTMLInputElement;
  $messageList: HTMLUListElement;
  messagesMap: Map<
    HTMLLIElement,
    {
      $fastMenu: HTMLDivElement;
      $menu: HTMLDivElement;
      $editFormContainer: HTMLDivElement;
      $messageContent: HTMLElement;
      message: RenderedPersonalMessage;
    }
  >;
  editedMessageContent: string;

  constructor(chat: Chat | null) {
    const $root = MainView.$mainContent;
    if (!$root) {
      ChatsMainContentView.throwNoRootInTheDomError('Main-content');
    }
    super($root);
    this.chat = chat;
    this.$chatInput = $('input', 'chat__input');
    this.$messageList = $('ul', 'chat__messages-list');
    this.messagesMap = new Map();
    this.editedMessageContent = '';
  }

  build(): void {
    const $container = $('div', 'chat');
    const $inputContainer = $('div', 'chat__input-container');

    if (this.chat) {
      const messages: RenderedPersonalMessage[] = [
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

      messages.forEach((message) => {
        this.$messageList.append(this.createMessageItem(message));
      });

      $inputContainer.append(this.$chatInput);
      $container.append(this.$messageList, $inputContainer);
    } else {
      $container.append('CHATS NOT FOUND!');
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
    this.messagesMap = new Map();
    messages.forEach((message) => {
      this.$messageList.append(this.createMessageItem(message));
    });
  };

  editMessageContent($message: HTMLLIElement, message: RenderedPersonalMessage): void {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    items.$messageContent.textContent = message.message;
    items.message = message;
  }

  createMessageItem(message_: RenderedPersonalMessage): HTMLLIElement {
    const { id, username, message, date } = message_;
    const $item = $('li', ['chat__messages-list-item', 'personal-message']);
    const $userIconBlock = $('div', 'personal-message__icon-block');
    const $userIcon = $('img', 'personal-message__icon');
    $userIcon.src = userIcon.default;

    const $messagesBlock = $('div', 'personal-message__massages-block');
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
    $messagesBlock.append($info, $message);
    $item.append($userIconBlock, $messagesBlock, $editFormContainer, $fastMenu, $menu);

    this.messagesMap.set($item, { $fastMenu, $menu, $editFormContainer, $messageContent: $message, message: message_ });

    return $item;
  }

  private resetInput() {
    this.$chatInput.value = '';
  }

  bindMessageHover = (
    displayFastMenuHandler: (
      $container: HTMLElement,
      $message: HTMLLIElement,
      message: RenderedPersonalMessage
    ) => Promise<void>
  ): void => {
    this.$messageList.onmouseover = async (mouseOverEvent) => {
      if (isClosestElementOfCssClass<HTMLLIElement>(mouseOverEvent.target, 'personal-message')) {
        if (!mouseOverEvent.target.classList.contains('personal-message_edit')) {
          const data = this.messagesMap.get(mouseOverEvent.target);
          if (data) {
            await displayFastMenuHandler(data.$fastMenu, mouseOverEvent.target, data.message);
            mouseOverEvent.target.onmouseleave = () => {
              this.destroyFastMenu(data.$fastMenu);
            };
          }
        }
      }
    };
  };

  bindDestroyFastMenu = (destroyFastMenuHandler: ($fastMenuContainer: HTMLElement) => void): void => {
    this.destroyFastMenu = destroyFastMenuHandler;
  };

  destroyFastMenu = ($fastMenuContainer: HTMLElement): void => {};

  createEditMessageForm($message: HTMLLIElement, message: RenderedPersonalMessage): HTMLFormElement {
    const $form = $('form', 'personal-message__edit-form');
    const $messageContainer = $('div', 'personal-message__edit-form-container');
    const $messageInput = $('input', 'personal-message__edit-form-input');
    const $messageIdInput = $('input');
    const $controlsContainer = $('div', 'personal-message__edit-form-controls');
    const $cancelControl = $('button', 'personal-message__edit-form-cancel');
    const $saveControl = $('button', 'personal-message__edit-form-save');

    $messageInput.name = 'message';
    $messageInput.value = message.message;

    $messageIdInput.name = 'id';
    $messageIdInput.type = 'hidden';
    $messageIdInput.value = message.id;

    $saveControl.type = 'submit';
    $saveControl.textContent = 'save';

    $cancelControl.type = 'button';
    $cancelControl.textContent = 'cancel';

    $messageContainer.append($messageInput);
    $controlsContainer.append('escape to ', $cancelControl, ' • enter to ', $saveControl);
    $form.append($messageContainer, $controlsContainer, $messageIdInput);

    $form.onsubmit = async (event) => {
      event.preventDefault();
      await this.onEditMessageFormSubmit(new FormData($form), $message);
      this.destroyEditMessageForm($message);
    };

    $cancelControl.onclick = () => {
      this.destroyEditMessageForm($message);
    };

    return $form;
  }

  displayEditMessageForm = ($message: HTMLLIElement): void => {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    const $form = this.createEditMessageForm($message, items.message);
    items.$editFormContainer.innerHTML = '';
    items.$editFormContainer.append($form);
    this.destroyFastMenu(items.$fastMenu);
    this.destroyOtherEditMessageForms($message);
    $message.classList.add('personal-message_edit');
    this.bindFormHotKeys($message, $form);
  };

  destroyEditMessageForm($message: HTMLLIElement): void {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    items.$editFormContainer.innerHTML = '';
    $message.classList.remove('personal-message_edit');
    this.resetFormHotKeys();
  }

  destroyOtherEditMessageForms($message: HTMLLIElement): void {
    this.messagesMap.forEach((_, $item) => {
      if ($message !== $item) {
        this.destroyEditMessageForm($item);
      }
    });
  }

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {};

  bindEditMessageFormSubmit = (handler: (formData: FormData, $message: HTMLLIElement) => Promise<void>): void => {
    this.onEditMessageFormSubmit = handler;
  };

  setEditedMessageContent = (content: string): void => {
    this.editedMessageContent = content;
  };

  bindFormHotKeys = ($message: HTMLLIElement, $form: HTMLFormElement): void => {
    window.onkeyup = (event) => {
      if (event.key === 'Escape') {
        this.destroyEditMessageForm($message);
      } else if (event.key === 'Enter') {
        console.log('enter');
        $form.submit();
      }
    };
  };

  resetFormHotKeys = () => {
    window.onkeyup = null;
  };
}

export default ChatsMainContentView;
