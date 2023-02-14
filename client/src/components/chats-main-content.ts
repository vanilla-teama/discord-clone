import Controller from '../lib/controller';
import socket, { emitPersonalMessage } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { Chat } from '../types/entities';
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
      appStore.bindPersonalMessageListChanged(this.onMessageListChange);
      await this.fetchMessages();
      this.view.bindMessageEvent(this.handleSendMessage);
      this.onSocketPersonalMessage();
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

  onMessageListChange = async (messages: RenderedPersonalMessage[]): Promise<void> => {
    this.view.displayMessages(messages);
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

  onSocketPersonalMessage() {
    socket.removeAllListeners('personalMessage');
    socket.on('personalMessage', async ({ fromUserId, toUserId }) => {
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
    // this.fastMenusMap.set($fastMenuContainer, { fastMenu, message });
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
  };

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {
    appStore.bindPersonalMessageDeleted(() => {
      this.view.deleteMessage($message);
    });
    await appStore.deletePersonalMessage(messageId);
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

  displayReply = (event: MouseEvent): void => {
    this.view.displayReply(event);
  };

  cancelDeleteConfirmDialog = () => {
    ModalView.hide();
  };
}

export default ChatsMainContentComponent;
