import Controller from '../lib/controller';
import socket, { emitPersonalMessage } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { Chat } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import { translation } from '../utils/lang';
import ChatsMainContentView, { RenderedPersonalMessage } from '../views/chats-main-content-view';
import ModalView from '../views/modal-view';
import ChatsScreen from './chats-screen';
import MessageFastMenu from './message-fast-menu';
import ModalComponent from './modal';

class ChatsMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
    this.fastMenusMap = new Map();
  }

  chat: Chat | null;
  fastMenusMap: Map<HTMLElement, { fastMenu: MessageFastMenu; message: RenderedPersonalMessage }>;

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }

    this.view.render();

    if (this.chat) {
      this.displayChatInput();
      appStore.bindPersonalMessageListChanged(this.onMessageListChange);
      await this.fetchMessages();
      this.view.bindMessageEvent(this.handleSendMessage);
      this.bindSocketPersonalMessage();
      this.bindSocketPersonalMessageUpdated();
      this.bindSocketPersonalMessageDeleted();
      this.bindAccountUpdated();
      this.view.bindOnMessageHoverKey(this.onMessageHoverKey);
      this.view.bindMessageHover(this.showFastMenu);
      MessageFastMenu.bindDisplayEditMessageForm(this.displayEditMessageForm);
      MessageFastMenu.bindDisplayDeleteConfirmModal(this.displayDeleteConfirmDialog);
      MessageFastMenu.bindDisplayReply(this.displayReply);
      this.view.bindFastMenuEditButtonClick(MessageFastMenu.onEditButtonClick);
      this.view.bindFastMenuDeleteButtonClick(MessageFastMenu.onDeleteButtonClick);
      this.view.bindFastMenuReplyButtonClick(MessageFastMenu.onReplyButtonClick);
      this.view.bindDestroyFastMenu(this.destroyFastMenu);
      this.view.bindEditMessageFormSubmit(this.onEditMessageFormSubmit);
      this.view.bindDeleteMessageDialogSubmit(this.onDeleteMessageDialogSubmit);
      this.view.bindMessageListClicks();
      this.view.bindCancelDeleteConfirmDialog(this.cancelDeleteConfirmDialog);
    }
  }

  private async fetchMessages(): Promise<void> {
    if (!appStore.user || !this.chat) {
      return;
    }
    await appStore.fetchPersonalMessages(appStore.user.id, this.chat.userId);
  }

  displayChatInput() {
    const __ = translation();
    if (!appStore.user || !this.chat) {
      return;
    }
    this.view.displayChatInput(`${__.common.messageTo} ${this.chat.userName}`);
  }

  onMessageListChange = async (messages: RenderedPersonalMessage[]): Promise<void> => {
    if (!this.chat || !appStore.user) {
      return;
    }
    const opponent = appStore.users.find((user) => user.id === this.chat?.userId);
    if (!opponent) {
      return;
    }
    const profiles = {
      [appStore.user.id]: appStore.user.profile,
      [opponent.id]: opponent.profile,
    };
    const messagesWithProfiles = messages.map((message) => ({
      ...message,
      profile: profiles[message.userId] ?? { about: null, avatar: null, banner: null },
    }));
    this.view.displayMessages(messagesWithProfiles);
    this.view.scrollToBottom();
  };

  handleSendMessage = async (messageText: string, responsedToMessageId: string | null): Promise<void> => {
    if (!appStore.user || !this.chat) {
      return;
    }
    const message: IncomingPersonalMessage = {
      fromUserId: appStore.user.id,
      toUserId: this.chat.userId,
      date: Date.now(),
      responsedToMessageId,
      message: messageText,
    };
    await appStore.addPersonalMessage(message);
    emitPersonalMessage(message);
  };

  bindSocketPersonalMessage() {
    socket.removeListener('personalMessage', ChatsMainContentComponent.onSocketPersonalMessage);
    socket.on(
      'personalMessage',
      (ChatsMainContentComponent.onSocketPersonalMessage = async ({ fromUserId, toUserId }) => {
        if (!this.chat) {
          return;
        }
        await this.fetchMessages();
      })
    );
  }

  bindSocketPersonalMessageUpdated() {
    socket.removeAllListeners('personalMessageUpdated');
    socket.on('personalMessageUpdated', async ({ messageId }) => {
      if (!this.chat) {
        return;
      }
      await this.fetchMessages();
    });
  }

  bindSocketPersonalMessageDeleted() {
    socket.removeAllListeners('personalMessageDeleted');
    socket.on('personalMessageDeleted', async ({ messageId }) => {
      if (!this.chat) {
        return;
      }
      await this.fetchMessages();
    });
  }

  showFastMenu = async (
    $fastMenuContainer: HTMLElement,
    $message: HTMLLIElement,
    message: RenderedPersonalMessage
  ): Promise<void> => {
    const fastMenu = new MessageFastMenu($fastMenuContainer, $message, message);
    await fastMenu.init();
  };

  destroyFastMenu = () => {
    if (MessageFastMenu.instance) {
      MessageFastMenu.instance.destroy();
    }
  };

  showEditForm = ($container: HTMLLIElement): void => {
    this.view.displayEditMessageForm($container);
  };

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {
    const id = formData.get('id');
    const message = formData.get('message');
    if (!id || !message || typeof id !== 'string' || typeof message !== 'string') {
      return;
    }
    appStore.bindPersonalMessageChanged((message: RenderedPersonalMessage) => {
      this.view.editMessageContent($message, message);
    });
    await appStore.editPersonalMessage(id, message);
    socket.emit('personalMessageUpdated', { messageId: id });
  };

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {
    appStore.bindPersonalMessageDeleted(() => {
      this.view.deleteMessage($message);
    });
    await appStore.deletePersonalMessage(messageId);
    socket.emit('personalMessageDeleted', { messageId });
    ModalView.hide();
  };

  displayEditMessageForm = (event: MouseEvent): void => {
    this.view.onDisplayEditMessageForm(event);
  };

  displayDeleteConfirmDialog = async (event: MouseEvent): Promise<void> => {
    await new ModalComponent().init();
    this.view.displayDeleteConfirmDialog(ModalView.getContainer(), event);
    ModalView.show();
  };

  displayDeleteConfirmDialogKeyup = async (event: MouseEvent, message: RenderedPersonalMessage): Promise<void> => {
    if (appStore.user?.id !== message.userId) {
      return;
    }
    await new ModalComponent().init();
    this.view.displayDeleteConfirmDialog(ModalView.getContainer(), event);
    ModalView.show();
  };

  displayReply = (event: MouseEvent): void => {
    this.view.displayReply(event);
  };

  onMessageHoverKey = async (
    key: string,
    $message: HTMLLIElement,
    message: RenderedPersonalMessage,
    isEdit: boolean,
    event: MouseEvent
  ): Promise<void> => {
    if (key === 'e') {
      if (isEdit) {
        return;
      }
      if (appStore.user?.id !== message.userId) {
        return;
      }
      this.view.displayEditMessageForm($message);
    } else if (key === 'r') {
      this.view.displayReply(event);
    } else if (key === 'backspace') {
      if (appStore.user?.id !== message.userId) {
        return;
      }
      this.displayDeleteConfirmDialogKeyup(event, message);
    }
  };

  cancelDeleteConfirmDialog = () => {
    ModalView.hide();
  };

  bindAccountUpdated() {
    document.removeEventListener(CustomEvents.ACCOUNTUPDATED, ChatsMainContentComponent.onAccountUpdated);
    document.addEventListener(
      CustomEvents.ACCOUNTUPDATED,
      (ChatsMainContentComponent.onAccountUpdated = (event) => {
        const {
          detail: { user },
        } = getTypedCustomEvent(CustomEvents.ACCOUNTUPDATED, event);
        if (!user) {
          return;
        }
        if (!this.chat || this.chat.userId !== user.id) {
          return;
        }
        const chat = appStore.chats.find((c) => c.userId === user.id);
        if (chat) {
          this.chat = chat;
          this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
        }
      })
    );
  }

  static onAccountUpdated: EventListener = () => {};

  static onSocketPersonalMessage: ServerToClientEvents['personalMessage'] = () => {};
}

export default ChatsMainContentComponent;
