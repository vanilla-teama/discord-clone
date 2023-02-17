import Controller from '../lib/controller';
import socket from '../lib/socket';
import { IncomingChannelMessage, appStore } from '../store/app-store';
import { Channel, Server } from '../types/entities';
import { ServerToClientEvents } from '../types/socket';
import ServersMainContentView, { RenderedChannelMessage } from '../views/servers-main-content-view';
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
        if (!this.channel) {
          return;
        }
        await this.fetchMessages();
      })
    );
  }

  static onSocketChannelMessage: ServerToClientEvents['channelMessage'] = () => {};

  static onSocketChannelMessageUpdated: ServerToClientEvents['channelMessageUpdated'] = () => {};

  static onSocketChannelMessageDeleted: ServerToClientEvents['channelMessageDeleted'] = () => {};
}

export default ServersMainContentComponent;
