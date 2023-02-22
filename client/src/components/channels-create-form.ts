import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Channel } from '../types/entities';
import { AppOmit } from '../types/utils';
import ChannelsCreateFormView from '../views/channels-create-form-view';

class ChannelsCreateFormComponent extends Controller<ChannelsCreateFormView> {
  serverId: string;

  constructor(serverId: string) {
    super(new ChannelsCreateFormView());
    this.serverId = serverId;
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindFormSubmit(this.handleAddChannel);
  }

  handleAddChannel = async (formData: FormData): Promise<void> => {
    const channel = this.extractChannel(formData);
    if (channel) {
      const createdChannel = await appStore.addChannel(channel, channel.serverId);
      if (createdChannel) {
        Router.push(RouteControllers.Servers, '', [this.serverId, createdChannel.id]);
      }
    }
  };

  private extractChannel = (formData: FormData): AppOmit<Channel, 'id'> | null => {
    const name = formData.get('name');

    if (typeof name === 'string' && name.trim()) {
      return {
        name: name.trim(),
        serverId: this.serverId,
        general: false,
      };
    }

    return null;
  };
}

export default ChannelsCreateFormComponent;
