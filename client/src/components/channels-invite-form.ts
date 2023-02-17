import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import ChannelsInviteFormView from '../views/channels-invite-form-view';
import ModalView from '../views/modal-view';

class ChannelsInviteFormComponent extends Controller<ChannelsInviteFormView> {
  channelId: string;

  constructor(channelId: string) {
    super(new ChannelsInviteFormView());
    this.channelId = channelId;
  }

  async init(): Promise<void> {
    this.view.bindOnInvite(this.onInvite);
    this.view.render();
    {
      const data = appStore.getChannelNameAndServerName(this.channelId);
      if (data) {
        this.view.displayTitle(data.serverName, data.channelName);
      }
    }
    this.view.displayFriendList(appStore.friends);
  }

  onInvite = async (userId: string, onSuccess: () => void): Promise<void> => {
    const data = appStore.getChannelNameAndServerName(this.channelId);
    if (data) {
      await appStore.updateUser(userId, { invitesToChannels: [this.channelId] });
      onSuccess();
    }
  };
}

export default ChannelsInviteFormComponent;
