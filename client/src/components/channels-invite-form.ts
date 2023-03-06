import Controller from '../lib/controller';
import socket from '../lib/socket';
import { IncomingChannelMessage, appStore } from '../store/app-store';
import { ChannelInvite } from '../types/entities';
import { translation } from '../utils/lang';
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
      const __ = translation();
      const data = appStore.getChannelNameAndServerName(this.channelId);
      const channel = appStore.getChannel(this.channelId);
      if (data) {
        let channelName = data.channelName;
        if (channel && channel.general) {
          channelName = __.common.general;
        }
        this.view.displayTitle(data.serverName, channelName);
      }
    }
    this.displayInviteFriendList();
  }

  displayInviteFriendList() {
    const friends = appStore.getInviteFriendList(this.channelId);
    this.view.displayFriendList(friends);
  }

  onInvite = async (userId: string, onSuccess: () => void): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    const data = appStore.getChannelNameAndServerName(this.channelId);
    if (data) {
      await appStore.updateUser(userId, { invitesToChannels: [this.channelId] });
      const message = await appStore.addChannelMessage(this.createInviteMessage(userId));
      if (message) {
        await appStore.addChannelInvite(this.createInvite(userId, this.channelId, message.id));
        socket.emit('userInvitedToChannel', { userId, channelId: this.channelId });
      }
      onSuccess();
    }
  };

  createInviteMessage(userId: string): IncomingChannelMessage {
    const user = appStore.users.find((u) => u.id === userId);
    const username = user?.name || 'Unknown User';
    return {
      service: true,
      channelId: this.channelId,
      date: Date.now(),
      message: `Invited ${username} to Channel`,
      userId: appStore.user?.id || '',
      responsedToMessageId: null,
    };
  }

  createInvite(userId: string, channelId: string, messageId: string): Partial<ChannelInvite> {
    return {
      channelId,
      userId,
      messageId,
      message: 'Welcome',
    };
  }
}

export default ChannelsInviteFormComponent;
