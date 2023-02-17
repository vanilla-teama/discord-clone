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
  editedMessageContent: string;

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
    this.editedMessageContent = '';
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

  bindMessageListClicks = () => {
    this.$messageList.addEventListener('click', (event) => {
      this.onFastMenuEditButtonClick(event);
      this.onFastMenuDeleteButtonClick(event);
      this.onFastMenuReplyButtonClick(event);
      this.onRepliedInfoClick(event);
    });
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

  destroyEditMessageForm($message: HTMLLIElement): void {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    items.$editFormContainer.innerHTML = '';
    $message.classList.remove('personal-message_edit');
    this.resetFormHotKeys();
  }

  displayEditMessageForm = ($message: HTMLLIElement): void => {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    const $form = this.createEditMessageForm($message, items.message);
    items.$editFormContainer.innerHTML = '';
    items.$editFormContainer.append($form);
    this.destroyFastMenu();
    this.destroyOtherEditMessageForms($message);
    $message.classList.add('channel-message_edit');
    this.bindFormHotKeys($message, $form);
  };

  destroyOtherEditMessageForms($message: HTMLLIElement): void {
    this.messagesMap.forEach((_, $item) => {
      if ($message !== $item) {
        this.destroyEditMessageForm($item);
      }
    });
  }

  displayDeleteConfirmDialog($container: HTMLElement, event: MouseEvent): void {
    if (!isClosestElementOfCssClass(event.target, 'channel-message')) {
      return;
    }
    const $message = event.target.closest<HTMLLIElement>('.channel-message');
    if (!$message) {
      return;
    }
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    const $deleteContainer = $('div', 'chat__delete-container');
    const $deleteContent = $('div', 'chat__delete-content');
    const $deleteTitle = $('div', 'chat__delete-title');
    const $deleteQuestion = $('div', 'chat__delete-question');
    const $info = $('div', ['chat__delete-info', 'channel-message__info']);
    const $userName = $('span', 'channel-message__name');
    const $messageDate = $('span', 'channel-message__date');
    const $messageItem = $('p', ['chat__delete-message-item', 'channel-message__message']);

    $deleteTitle.textContent = `Delete message.`;
    $deleteQuestion.textContent = `Are you sure you want to delete this?`;
    $userName.textContent = `${items.message.username}`;
    $messageDate.textContent = `${items.message.date}`;
    $messageItem.textContent = items.message.message;

    const $deleteButtons = $('div', 'chat__delete-buttons');
    const $cancelButton = $('button', 'chat__delete-btn-cancel');
    const $confirmButton = $('button', 'chat__delete-btn-delete');

    $cancelButton.textContent = 'Cancel';
    $confirmButton.textContent = 'Delete';

    $info.append($userName, $messageDate, $messageItem);
    $deleteContent.append($deleteTitle, $deleteQuestion, $info);
    $deleteButtons.append($cancelButton, $confirmButton);
    $deleteContainer.append($deleteContent, $deleteButtons);

    $container.append($deleteContainer);

    $cancelButton.onclick = () => {
      this.cancelDeleteConfirmDialog();
    };

    $confirmButton.onclick = () => {
      this.onDeleteMessageDialogSubmit(items.message.id, $message);
    };
  }

  displayReply(event: MouseEvent): void {
    if (!isClosestElementOfCssClass(event.target, 'channel-message')) {
      return;
    }
    const $message = event.target.closest<HTMLLIElement>('.channel-message');
    if (!$message) {
      return;
    }
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    this.messagesMap.forEach((items, $item) => {
      if ($message !== $item) {
        this.destroyReply($item);
      }
    });
    $message.classList.add('channel-message_reply');
    this.$repliedMessage = $message;
    this.displayInputReply($message, items.message.username);
    this.$chatInput.focus();
  }

  displayInputReply($message: HTMLLIElement, username: string): void {
    this.$replyContainer.innerHTML = '';
    this.$replyContainer.append(this.createReplyNotification($message, username));
  }

  createReplyNotification($message: HTMLLIElement, username: string): HTMLDivElement {
    const $notification = $('div', 'chat__reply-notification');
    const $notifMessageContainer = $('div', 'chat__reply-notification-message-container');
    const $notifMessageText = $('span', 'chat__reply-notification-message-text');
    const $notifMessageUser = $('span', 'chat__reply-notification-message-user');
    //$notifMessage.innerHTML = `Replying to <strong>${username}</strong>`;
    $notifMessageText.textContent = 'Replying to';
    $notifMessageUser.textContent = username;
    const $destroyButton = $('button', 'chat__reply-notification-message-destroy');

    $notifMessageContainer.append($notifMessageText, $notifMessageUser);
    $notification.append($notifMessageContainer, $destroyButton);

    $destroyButton.onclick = () => {
      this.destroyReply($message);
    };
    return $notification;
  }

  createEditMessageForm($message: HTMLLIElement, message: RenderedChannelMessage): HTMLFormElement {
    const $form = $('form', 'channel-message__edit-form');
    const $messageContainer = $('div', 'channel-message__edit-form-container');
    const $messageInput = $('input', 'channel-message__edit-form-input');
    const $messageIdInput = $('input');
    const $replyIdInput = $('input');
    const $controlsContainer = $('div', 'channel-message__edit-form-controls');
    const $cancelControl = $('button', 'channel-message__edit-form-cancel');
    const $saveControl = $('button', 'channel-message__edit-form-save');

    $messageInput.name = 'message';
    $messageInput.value = message.message;

    $messageIdInput.name = 'id';
    $messageIdInput.type = 'hidden';
    $messageIdInput.value = message.id;

    $replyIdInput.name = 'responsedToMessageId';
    $replyIdInput.type = 'hidden';
    $replyIdInput.value = this.getReplyId() || '';

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

  editMessageContent($message: HTMLLIElement, message: RenderedChannelMessage): void {
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    items.$messageContent.textContent = message.message;
    items.message = message;
  }

  deleteMessage($message: HTMLLIElement): void {
    $message.remove();
  }

  onRepliedInfoClick = (event: MouseEvent): void => {
    if (isClosestElementOfCssClass(event.target, 'channel-message__replied-info')) {
      const $info = event.target.closest<HTMLElement>('.channel-message__replied-info');
      if ($info) {
        const messageSelector = $info.dataset.scrollTo;
        const $message = document.querySelector<HTMLElement>(messageSelector || '');
        if ($message) {
          $message.scrollIntoView();
        }
      }
    }
  };

  onDisplayEditMessageForm = (event: MouseEvent): void => {
    if (isClosestElementOfCssClass<HTMLLIElement>(event.target, 'channel-message')) {
      const $message = event.target.closest<HTMLLIElement>('.channel-message');
      if ($message) {
        this.displayEditMessageForm($message);
      }
    }
  };

  onFastMenuEditButtonClick = (event: MouseEvent): void => {
    console.log('Not binded');
  };

  onFastMenuDeleteButtonClick = (event: MouseEvent): void => {};

  onFastMenuReplyButtonClick = (event: MouseEvent): void => {};

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {};

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {};

  cancelDeleteConfirmDialog = (): void => {};

  bindEditMessageFormSubmit = (handler: (formData: FormData, $message: HTMLLIElement) => Promise<void>): void => {
    this.onEditMessageFormSubmit = handler;
  };

  bindDeleteMessageDialogSubmit = (handler: (messageId: string, $message: HTMLLIElement) => Promise<void>): void => {
    this.onDeleteMessageDialogSubmit = handler;
  };

  bindFastMenuEditButtonClick = (handler: (event: MouseEvent) => void): void => {
    this.onFastMenuEditButtonClick = handler;
  };

  bindFastMenuDeleteButtonClick = (handler: (event: MouseEvent) => void): void => {
    this.onFastMenuDeleteButtonClick = handler;
  };

  bindCancelDeleteConfirmDialog = (handler: () => void): void => {
    this.cancelDeleteConfirmDialog = handler;
  };

  bindFastMenuReplyButtonClick = (handler: (event: MouseEvent) => void): void => {
    this.onFastMenuReplyButtonClick = handler;
  };

  bindFormHotKeys = ($message: HTMLLIElement, $form: HTMLFormElement): void => {
    window.onkeyup = (event) => {
      if (event.key === 'Escape') {
        this.destroyEditMessageForm($message);
      } else if (event.key === 'Enter') {
        $form.submit();
      }
    };
  };

  resetFormHotKeys = () => {
    window.onkeyup = null;
  };
}

export default ServersMainContentView;
