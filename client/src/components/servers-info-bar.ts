import Controller from '../lib/controller';
import Router from '../lib/router';
import { appStore } from '../store/app-store';
import { Channel } from '../types/entities';
import ChatsInfoBarView from '../views/chats-info-bar-view';
import ServersInfoBarView from '../views/servers-info-bar-view';

class ServersInfoBarComponent extends Controller<ServersInfoBarView> {
  channel: Channel | null;

  constructor() {
    super(new ServersInfoBarView());
    this.channel = this.getCurrentChannel();
  }

  async init(): Promise<void> {
    this.view.render();
    if (this.channel) {
      this.displayMembers();
    }
  }

  displayMembers() {
    if (!this.channel) {
      return;
    }
    this.view.displayMembers(appStore.getChannelMembers(this.channel.id), appStore.getChannelOwner(this.channel.id));
  }

  getCurrentChannel(): Channel | null {
    const channelId = new Router().getParams()[1];
    return appStore.getChannel(channelId);
  }
}

export default ServersInfoBarComponent;
