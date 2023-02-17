import Controller from '../lib/controller';
import socket from '../lib/socket';
import { IncomingChannelMessage, appStore } from '../store/app-store';
import { Channel, Server } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import ServersMainContentView, { RenderedChannelMessage } from '../views/servers-main-content-view';
import MessageFastMenu from './message-fast-menu';
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
      this.view.bindDestroyFastMenu(this.destroyFastMenu);
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

  static onSocketChannelMessage: ServerToClientEvents['channelMessage'] = () => {};

  static onSocketChannelMessageUpdated: ServerToClientEvents['channelMessageUpdated'] = () => {};

  static onSocketChannelMessageDeleted: ServerToClientEvents['channelMessageDeleted'] = () => {};
}

export default ServersMainContentComponent;
