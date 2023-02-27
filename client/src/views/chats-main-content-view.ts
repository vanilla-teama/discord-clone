import * as userIcon from '../assets/icons/discord.svg';
import View from '../lib/view';
import { Chat, MongoObjectId, Profile } from '../types/entities';
import { $, base64Url, capitalize, isClosestElementOfCssClass } from '../utils/functions';
import { translation } from '../utils/lang';
import MainView from './main-view';


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
  $replyContainer: HTMLDivElement;
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
  $repliedMessage: HTMLLIElement | null;
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
    this.$replyContainer = $('div', 'chat__reply-container');
    this.messagesMap = new Map();
    this.editedMessageContent = '';
    this.$repliedMessage = null;
  }

  build(): void {
    const __ = translation();
    const $container = $('div', 'chat');
    const $inputContainer = $('div', 'chat__input-container');

    if (this.chat) {

      //const messagesWithProfiles = personalMessages.map((message) => ({
      //  ...message,
      //  profile: { about: null, avatar: null, banner: null },
      //}));

      //this.messagesMap = new Map();
      //messagesWithProfiles.forEach((message) => {
      //  this.$messageList.append(this.createMessageItem(message));
      //});

      $inputContainer.append(this.$replyContainer, this.$chatInput);
      $container.append(this.$messageList, $inputContainer);
    } else {
      const $notFound = $('div', 'chat__not-found');
      $notFound.textContent = __.common.noChat;
      $container.append($notFound);
    }
    this.$container.append($container);
  }

  displayChatInput(placeholder: string) {
    this.$chatInput.placeholder = placeholder;
  }

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

  displayMessages = (messages: (RenderedPersonalMessage & { profile: Profile })[]) => {
    this.$messageList.innerHTML = '';

    this.messagesMap = new Map();
    messages.forEach((message) => {
      this.$messageList.append(this.createMessageItem(message));
    });
  };

  scrollToBottom(): void {
    this.$messageList.scrollTo(0, this.$messageList.scrollHeight);
  }

  editMessageContent($message: HTMLLIElement, message: RenderedPersonalMessage): void {
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

  createMessageItem(message_: RenderedPersonalMessage & { profile: Profile }): HTMLLIElement {
    const { id, username, message, date, responsedToMessage } = message_;
    const $item = $('li', ['chat__messages-list-item', 'personal-message']);
    const $userIconBlock = $('div', 'personal-message__icon-block');
    const $userIcon = $('img', 'personal-message__icon');
    $userIcon.src = message_.profile.avatar ? base64Url(message_.profile.avatar) : userIcon.default;

    const $userBlock = $('div', 'personal-message__user-block');
    const $messageBlock = $('div', 'personal-message__massages-block');
    const $info = $('div', 'personal-message__info');
    const $userName = $('span', 'personal-message__name');
    const $messageDate = $('span', 'personal-message__date');
    const $message = $('p', 'personal-message__message');
    const $fastMenu = $('div', 'chat__fast-menu');
    const $editFormContainer = $('div', 'personal-message__edit-form-container');
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
      const $repliedInfo = $('p', 'personal-message__replied-info');
      $repliedInfo.textContent = `${responsedToMessage.username} | ${responsedToMessage.message}`;
      $repliedInfo.dataset.scrollTo = `#personal-message-${responsedToMessage.id}`;
      $messageBlock.prepend($repliedInfo);
      $item.classList.add('replied');
    }

    $item.id = `personal-message-${id}`;

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
        const isEdit = mouseOverEvent.target.classList.contains('personal-message_edit');
        if (!isEdit) {
          const $message = mouseOverEvent.target.closest<HTMLLIElement>('.personal-message');
          const items = this.messagesMap.get(mouseOverEvent.target);
          if (items) {
            await displayFastMenuHandler(items.$fastMenu, mouseOverEvent.target, items.message);

            window.removeEventListener('keyup', ChatsMainContentView.onMessageHoverKeyup);
            window.addEventListener(
              'keyup',
              (ChatsMainContentView.onMessageHoverKeyup = (event) => {
                const key = event.key.toLowerCase();
                if (!$message) {
                  return;
                }
                this.onMessageHoverKey(key, $message, items.message, isEdit, mouseOverEvent);
              })
            );
            mouseOverEvent.target.onmouseleave = () => {
              this.destroyFastMenu();
              window.removeEventListener('keyup', ChatsMainContentView.onMessageHoverKeyup);
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

  onRepliedInfoClick = (event: MouseEvent): void => {
    if (isClosestElementOfCssClass(event.target, 'personal-message__replied-info')) {
      const $info = event.target.closest<HTMLElement>('.personal-message__replied-info');
      if ($info) {
        const messageSelector = $info.dataset.scrollTo;
        const $message = document.querySelector<HTMLElement>(messageSelector || '');
        if ($message) {
          $message.scrollIntoView();
        }
      }
    }
  };

  bindDestroyFastMenu = (destroyFastMenuHandler: () => void): void => {
    this.destroyFastMenu = destroyFastMenuHandler;
  };

  destroyFastMenu = (): void => {};

  createEditMessageForm($message: HTMLLIElement, message: RenderedPersonalMessage): HTMLFormElement {
    const __ = translation();
    const $form = $('form', 'personal-message__edit-form');
    const $messageContainer = $('div', 'personal-message__edit-form-container');
    const $messageInput = $('input', 'personal-message__edit-form-input');
    const $messageIdInput = $('input');
    const $replyIdInput = $('input');
    const $controlsContainer = $('div', 'personal-message__edit-form-controls');
    const $cancelControl = $('button', 'personal-message__edit-form-cancel');
    const $saveControl = $('button', 'personal-message__edit-form-save');

    $messageInput.name = 'message';
    $messageInput.value = message.message;

    $messageIdInput.name = 'id';
    $messageIdInput.type = 'hidden';
    $messageIdInput.value = message.id;

    $replyIdInput.name = 'responsedToMessageId';
    $replyIdInput.type = 'hidden';
    $replyIdInput.value = this.getReplyId() || '';

    $saveControl.type = 'submit';
    $saveControl.textContent = __.common.save;

    $cancelControl.type = 'button';
    $cancelControl.textContent = __.common.cancel;

    $messageContainer.append($messageInput);
    $controlsContainer.append(`${__.common.escapeTo} `, $cancelControl, ` • ${__.common.enterTo} `, $saveControl);
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
    this.destroyFastMenu();
    this.destroyOtherEditMessageForms($message);
    this.destroyOthersReply($message);
    this.destroyReply($message);
    $message.classList.add('personal-message_edit');
    this.bindFormHotKeys($message, $form);
  };

  onDisplayEditMessageForm = (event: MouseEvent): void => {
    if (isClosestElementOfCssClass<HTMLLIElement>(event.target, 'personal-message')) {
      const $message = event.target.closest<HTMLLIElement>('.personal-message');
      if ($message) {
        this.displayEditMessageForm($message);
      }
    }
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

  displayDeleteConfirmDialog($container: HTMLElement, event: MouseEvent): void {
    const __ = translation();
    if (!isClosestElementOfCssClass(event.target, 'personal-message')) {
      return;
    }
    const $message = event.target.closest<HTMLLIElement>('.personal-message');
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
    const $info = $('div', ['chat__delete-info', 'personal-message__info']);
    const $userName = $('span', 'personal-message__name');
    const $messageDate = $('span', 'personal-message__date');
    const $messageItem = $('p', ['chat__delete-message-item', 'personal-message__message']);

    $deleteTitle.textContent = __.deleteMessageDialog.heading;
    $deleteQuestion.textContent = __.deleteMessageDialog.question;
    $userName.textContent = `${items.message.username}`;
    $messageDate.textContent = `${items.message.date}`;
    $messageItem.textContent = items.message.message;

    const $deleteButtons = $('div', 'chat__delete-buttons');
    const $cancelButton = $('button', 'chat__delete-btn-cancel');
    const $confirmButton = $('button', 'chat__delete-btn-delete');

    $cancelButton.textContent = capitalize(__.common.cancel);
    $confirmButton.textContent = capitalize(__.common.delete);

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
    if (!isClosestElementOfCssClass(event.target, 'personal-message')) {
      return;
    }
    const $message = event.target.closest<HTMLLIElement>('.personal-message');
    if (!$message) {
      return;
    }
    const items = this.messagesMap.get($message);
    if (!items) {
      return;
    }
    this.destroyOthersReply($message);
    this.destroyOtherEditMessageForms($message);
    this.destroyEditMessageForm($message);
    $message.classList.add('personal-message_reply');
    this.$repliedMessage = $message;
    this.displayInputReply($message, items.message.username);
    this.$chatInput.focus();

    window.removeEventListener('keyup', ChatsMainContentView.onReplyEscapeKeyup);
    window.addEventListener(
      'keyup',
      (ChatsMainContentView.onReplyEscapeKeyup = (event) => {
        if (!event.key) {
          return;
        }
        const key = event.key.toLowerCase();
        if (key === 'escape') {
          this.destroyReply($message);
        }
      })
    );
  }

  displayInputReply($message: HTMLLIElement, username: string): void {
    this.$replyContainer.innerHTML = '';
    this.$replyContainer.append(this.createReplyNotification($message, username));
  }

  createReplyNotification($message: HTMLLIElement, username: string): HTMLDivElement {
    const __ = translation();
    const $notification = $('div', 'chat__reply-notification');
    const $notifMessageContainer = $('div', 'chat__reply-notification-message-container');
    const $notifMessageText = $('span', 'chat__reply-notification-message-text');
    const $notifMessageUser = $('span', 'chat__reply-notification-message-user');
    //$notifMessage.innerHTML = `Replying to <strong>${username}</strong>`;
    $notifMessageText.textContent = __.common.replyingTo;
    $notifMessageUser.textContent = username;
    const $destroyButton = $('button', 'chat__reply-notification-message-destroy');

    $notifMessageContainer.append($notifMessageText, $notifMessageUser);
    $notification.append($notifMessageContainer, $destroyButton);

    $destroyButton.onclick = () => {
      this.destroyReply($message);
    };
    return $notification;
  }

  destroyReply($message: HTMLLIElement): void {
    this.$repliedMessage = null;
    $message.classList.remove('personal-message_reply');
    this.destroyInputReply();
  }

  destroyOthersReply($message: HTMLLIElement) {
    this.messagesMap.forEach((items, $item) => {
      if ($message !== $item) {
        this.destroyReply($item);
      }
    });
  }

  destroyInputReply(): void {
    this.$replyContainer.innerHTML = '';
  }

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

  onFastMenuEditButtonClick = (event: MouseEvent): void => {
    console.log('Not binded');
  };

  onFastMenuDeleteButtonClick = (event: MouseEvent): void => {};

  onFastMenuReplyButtonClick = (event: MouseEvent): void => {};

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {};

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {};

  static onMessageHoverKeyup = (event: KeyboardEvent): void => {};

  onMessageHoverKey = (
    key: string,
    $message: HTMLLIElement,
    message: RenderedPersonalMessage,
    isEdit: boolean,
    event: MouseEvent
  ): void => {};

  static onReplyEscapeKeyup = (event: KeyboardEvent): void => {};

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

  bindOnMessageHoverKey = (
    handler: (
      key: string,
      $message: HTMLLIElement,
      message: RenderedPersonalMessage,
      isEdit: boolean,
      event: MouseEvent
    ) => Promise<void>
  ) => {
    this.onMessageHoverKey = handler;
  };

  setEditedMessageContent = (content: string): void => {
    this.editedMessageContent = content;
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

export default ChatsMainContentView;
