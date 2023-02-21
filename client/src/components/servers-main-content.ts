import Controller from '../lib/controller';
import socket from '../lib/socket';
import { IncomingChannelMessage, appStore } from '../store/app-store';
import { Channel, ChannelInvite, Profile, Server } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import ModalView from '../views/modal-view';
import ServersMainContentView, { RenderedChannelMessage } from '../views/servers-main-content-view';
import MessageFastMenu from './message-fast-menu';
import ModalComponent from './modal';
import ServersScreen from './servers-screen';

class ServersMainContentComponent extends Controller<ServersMainContentView> {
  server: Server | null;
  channel: Channel | null;
  fastMenusMap: Map<HTMLElement, { fastMenu: MessageFastMenu; message: RenderedChannelMessage }>;

  constructor() {
    super(new ServersMainContentView(ServersScreen.channel));
    this.server = ServersScreen.server;
    this.channel = ServersScreen.channel;
    this.fastMenusMap = new Map();
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }

    this.view.render();
    if (this.channel) {
      appStore.bindChannelMessageListChanged(this.onMessageListChange);
      await this.fetchData();
      this.view.bindMessageEvent(this.handleSendMessage);
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
      this.view.bindOnMessageHoverBackspaceKeyup(this.displayDeleteConfirmDialogKeyup);
      this.view.bindMessageListClicks();
      this.view.bindCancelDeleteConfirmDialog(this.cancelDeleteConfirmDialog);
    }
  }

  private async fetchData(): Promise<void> {
    if (!appStore.user || !this.channel) {
      return;
    }
    await Promise.all([await this.fetchMessages(), await appStore.fetchChannelInvites(this.channel.id)]);
  }

  private async fetchMessages(): Promise<void> {
    if (!appStore.user || !this.channel) {
      return;
    }
    await appStore.fetchChannelMessages(this.channel.id);
  }

  onMessageListChange = async (messages: RenderedChannelMessage[], invites: ChannelInvite[]): Promise<void> => {
    if (!this.channel || !appStore.user) {
      return;
    }
    const messagesWithProfiles: (RenderedChannelMessage & { profile: Profile | null })[] = [];
    messages.forEach((message) => {
      const user = appStore.users.find((u) => u.id === message.userId);
      if (!user) {
        return;
      }
      messagesWithProfiles.push({ ...message, profile: message.service ? null : user.profile });
    });
    this.view.displayMessages(messagesWithProfiles, invites);
  };

  handleSendMessage = async (messageText: string, responsedToMessageId: string | null): Promise<void> => {
    if (!appStore.user || !this.channel) {
      return;
    }
    const message: IncomingChannelMessage = {
      service: false,
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

    socket.removeListener('channelMessageUpdated', ServersMainContentComponent.onSocketChannelMessageUpdated);
    socket.on(
      'channelMessageUpdated',
      (ServersMainContentComponent.onSocketChannelMessageUpdated = async ({ messageId }) => {
        if (!this.channel) {
          return;
        }
        await this.fetchMessages();
      })
    );

    socket.removeListener('channelMessageDeleted', ServersMainContentComponent.onSocketChannelMessageDeleted);
    socket.on(
      'channelMessageDeleted',
      (ServersMainContentComponent.onSocketChannelMessageDeleted = async ({ messageId }) => {
        if (!this.channel) {
          return;
        }
        await this.fetchMessages();
      })
    );

    socket.removeListener('userInvitedToChannel', ServersMainContentComponent.onSocketUserInvitedToChannel);
    socket.on(
      'userInvitedToChannel',
      (ServersMainContentComponent.onSocketUserInvitedToChannel = async ({ userId, channelId }) => {
        if (!this.channel) {
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

  showEditForm = ($container: HTMLLIElement): void => {
    this.view.displayEditMessageForm($container);
  };

  displayEditMessageForm = (event: MouseEvent): void => {
    this.view.onDisplayEditMessageForm(event);
  };

  displayDeleteConfirmDialog = async (event: MouseEvent): Promise<void> => {
    await new ModalComponent().init();
    this.view.displayDeleteConfirmDialog(ModalView.getContainer(), event);
    ModalView.show();
  };

  displayDeleteConfirmDialogKeyup = async (event: MouseEvent, message: RenderedChannelMessage): Promise<void> => {
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

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {
    const id = formData.get('id');
    const message = formData.get('message');
    if (!id || !message || typeof id !== 'string' || typeof message !== 'string') {
      return;
    }
    appStore.bindChannelMessageChanged((message: RenderedChannelMessage) => {
      this.view.editMessageContent($message, message);
    });
    await appStore.editChannelMessage(id, message);
    socket.emit('channelMessageUpdated', { messageId: id });
  };

  onDeleteMessageDialogSubmit = async (messageId: string, $message: HTMLLIElement): Promise<void> => {
    appStore.bindChannelMessageDeleted(() => {
      this.view.deleteMessage($message);
    });
    await appStore.deleteChannelMessage(messageId);
    socket.emit('channelMessageDeleted', { messageId });
    ModalView.hide();
  };

  cancelDeleteConfirmDialog = () => {
    ModalView.hide();
  };

  static onSocketChannelMessage: ServerToClientEvents['channelMessage'] = () => {};

  static onSocketChannelMessageUpdated: ServerToClientEvents['channelMessageUpdated'] = () => {};

  static onSocketChannelMessageDeleted: ServerToClientEvents['channelMessageDeleted'] = () => {};

  static onSocketUserInvitedToChannel: ServerToClientEvents['userInvitedToChannel'] = () => {};
}

export default ServersMainContentComponent;
