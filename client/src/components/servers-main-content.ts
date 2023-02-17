import Controller from '../lib/controller';
import socket from '../lib/socket';
import { IncomingChannelMessage, appStore } from '../store/app-store';
import { Channel, Server } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import ModalView from '../views/modal-view';
import ServersMainContentView, { RenderedChannelMessage } from '../views/servers-main-content-view';
import MessageFastMenu from './message-fast-menu';
import ModalComponent from './modal';
import ServersScreen from './servers-screen';

class ServersMainContentComponent extends Controller<ServersMainContentView> {
  server: Server | null;
  channel: Channel | null;

  constructor() {
    super(new ServersMainContentView());
    this.server = ServersScreen.server;
    this.channel = ServersScreen.channel;
  }

  async init(): Promise<void> {
    this.view.render();
    if (this.channel) {
      appStore.bindChannelMessageListChanged(this.onMessageListChange);
      this.view.bindMessageEvent(this.handleSendMessage);
      await this.fetchMessages();
      this.bindSocketEvents();
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
    if (!appStore.user || !this.channel) {
      return;
    }
    await appStore.fetchChannelMessages(this.channel.id);
  }

  onMessageListChange = async (messages: RenderedChannelMessage[]): Promise<void> => {
    console.log(messages);
    this.view.displayMessages(messages);
  };

  handleSendMessage = async (messageText: string, responsedToMessageId: string | null): Promise<void> => {
    if (!appStore.user || !this.channel) {
      return;
    }
    const message: IncomingChannelMessage = {
      userId: appStore.user.id,
      channelId: this.channel.id,
      date: Date.now(),
      responsedToMessageId,
      message: messageText,
    };
    await appStore.addChannelMessage(message);
    socket.emit('channelMessage', { userId: appStore.user.id, channelId: this.channel.id });
  };

  bindSocketEvents() {
    socket.removeListener('channelMessage', ServersMainContentComponent.onSocketChannelMessage);
    socket.on(
      'channelMessage',
      (ServersMainContentComponent.onSocketChannelMessage = async ({ channelId, userId }) => {
        if (!this.channel || this.channel.id !== channelId) {
          return;
        }
        await this.fetchMessages();
      })
    );
  }

  showFastMenu = async (
    $fastMenuContainer: HTMLElement,
    $message: HTMLLIElement,
    message: RenderedChannelMessage
  ): Promise<void> => {
    const fastMenu = new MessageFastMenu($fastMenuContainer, $message, message);
    await fastMenu.init();
  };

  destroyFastMenu = () => {
    if (MessageFastMenu.instance) {
      MessageFastMenu.instance.destroy();
    }
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

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {
    const id = formData.get('id');
    const message = formData.get('message');
    if (!id || !message || typeof id !== 'string' || typeof message !== 'string') {
      return;
    }
    appStore.bindPersonalMessageChanged((message: RenderedChannelMessage) => {
      this.view.editMessageContent($message, message);
    });
    await appStore.editPersonalMessage(id, message);
    socket.emit('channelMessageUpdated', { messageId: id });
  };

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {
    appStore.bindPersonalMessageDeleted(() => {
      this.view.deleteMessage($message);
    });
    await appStore.deletePersonalMessage(messageId);
    socket.emit('channelMessageDeleted', { messageId });
    ModalView.hide();
  };

  cancelDeleteConfirmDialog = () => {
    ModalView.hide();
  };

  static onSocketChannelMessage: ServerToClientEvents['channelMessage'] = () => {};

  static onSocketChannelMessageUpdated: ServerToClientEvents['channelMessageUpdated'] = () => {};

  static onSocketChannelMessageDeleted: ServerToClientEvents['channelMessageDeleted'] = () => {};
}

export default ServersMainContentComponent;
