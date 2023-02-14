import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Channel } from '../types/entities';
import ChannelsInviteFormView from '../views/channels-invite-form-view';

class ChannelsInviteFormComponent extends Controller<ChannelsInviteFormView> {
  channelId: string;

  constructor(channelId: string) {
    super(new ChannelsInviteFormView());
    this.channelId = channelId;
  }

  async init(): Promise<void> {
    this.view.render();
    {
      const data = appStore.getChannelNameAndServerName(this.channelId);
      if (data) {
        this.view.displayTitle(data.serverName, data.channelName);
      }
    }
    this.view.bindFormSubmit(this.handleAddChannel);
  }

  handleAddChannel = async (formData: FormData): Promise<void> => {
    const channel = this.extractChannel(formData);
    if (channel) {
      const createdChannel = await appStore.addChannel(channel, channel.serverId);
      if (createdChannel) {
        Router.push(RouteControllers.Servers, '', [this.channelId, createdChannel.id]);
      }
    }
  };

  private extractChannel = (formData: FormData): Pick<Channel, 'name' | 'serverId'> | null => {
    const name = formData.get('name');

    if (typeof name === 'string' && name.trim()) {
      return {
        name: name.trim(),
        serverId: this.channelId,
      };
    }

    return null;
  };
}

export default ChannelsInviteFormComponent;
