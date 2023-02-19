import { chats, users } from '../develop/data';
import { ErrorStatusCode, http, isExpressError } from '../lib/http';
import moment from '../lib/moment';
import {
  Channel,
  ChannelInvite,
  ChannelMessage,
  Chat,
  ChatAvailabilitiesMap,
  PersonalMessage,
  Server,
  ServerOwner,
  User,
} from '../types/entities';
import { LoginError, RegisterError, RegisterErrorData } from '../types/http-errors';
import { AppOmit } from '../types/utils';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';
import { RenderedChannelMessage } from '../views/servers-main-content-view';

export type IncomingPersonalMessage = AppOmit<PersonalMessage, 'id' | 'responsedToMessage'>;
export type IncomingChannelMessage = AppOmit<ChannelMessage, 'id' | 'responsedToMessage'>;

class AppStore {
  private static instance: AppStore;

  private _user: User | null = null; // Current user

  private _users: User[] = [];

  private _friends: User[] = [];

  private _invitedToFriends: User[] = [];

  private _invitedFromFriends: User[] = [];

  private _channels: Channel[] = []; // Current user related channels

  private _chats: Chat[] = []; // Current user related chats

  private _chatStatuses: ChatAvailabilitiesMap = new Map();

  private _personalMessages: PersonalMessage[] = [];

  private _channelMessages: ChannelMessage[] = [];

  private _lastAddedChannelMessage: ChannelMessage | null = null;

  private _channelInvites: ChannelInvite[] = [];

  private _servers: Server[] = []; // Current user related servers

  private _allServers: Server[] = []; // All servers

  get isAuth(): boolean {
    return Boolean(this.user);
  }

  get user(): User | null {
    return this._user;
  }

  private set user(user: User | null) {
    this._user = user;
  }

  get users(): User[] {
    return this._users;
  }

  private set users(users: User[]) {
    this._users = users;
  }

  get friends(): User[] {
    return this._friends;
  }

  private set friends(friends: User[]) {
    this._friends = friends;
  }

  get invitedToFriends(): User[] {
    return this._invitedToFriends;
  }

  private set invitedToFriends(friends: User[]) {
    this._invitedToFriends = friends;
  }

  get invitedFromFriends(): User[] {
    return this._invitedFromFriends;
  }

  private set invitedFromFriends(friends: User[]) {
    this._invitedFromFriends = friends;
  }

  get chats(): Chat[] {
    return this._chats;
  }

  private set chats(chats: Chat[]) {
    this._chats = chats;
  }

  private set channels(channels: Channel[]) {
    this._channels = channels;
  }

  get channels(): Channel[] {
    return this._channels;
  }

  get chatStatuses(): ChatAvailabilitiesMap {
    return this._chatStatuses;
  }

  private set chatStatuses(statuses: ChatAvailabilitiesMap) {
    this._chatStatuses = statuses;
  }

  get personalMessages(): PersonalMessage[] {
    return this._personalMessages;
  }

  private set personalMessages(messages: PersonalMessage[]) {
    this._personalMessages = messages;
  }

  get channelMessages(): ChannelMessage[] {
    return this._channelMessages;
  }

  private set channelMessages(messages: ChannelMessage[]) {
    this._channelMessages = messages;
  }

  get channelInvites(): ChannelInvite[] {
    return this._channelInvites;
  }

  private set channelInvites(invites: ChannelInvite[]) {
    this._channelInvites = invites;
  }

  get servers(): Server[] {
    return this._servers;
  }

  private set servers(servers: Server[]) {
    this._servers = servers;
  }

  get allServers(): Server[] {
    return this._allServers;
  }

  private set allServers(servers: Server[]) {
    this._allServers = servers;
  }

  getServer(serverId: string): Server | null {
    return this.allServers.find(({ id }) => serverId === id) || null;
  }

  getChannel(channelId: string): Channel | null {
    return this.channels.find(({ id }) => id === channelId) || null;
  }

  getServerOwner(serverId: string): ServerOwner | null {
    return this.getServer(serverId)?.owner || null;
  }

  getChannelOwner(channelId: string): ServerOwner | null {
    const channel = this.getChannel(channelId);
    if (channel) {
      return this.getServer(channel.serverId)?.owner || null;
    }
    return null;
  }

  getChannelMembers(channelId: string): User[] {
    const invitedUsers = this.users.filter((user) => {
      if (!user.invitesToChannels) {
        return false;
      }
      return user.invitesToChannels.some((channel) => channel.id == channelId);
    });

    const owner = this.getChannelOwner(channelId);
    const ownerUser = this.users.find((user) => user.id === owner?.id) || null;

    return invitedUsers.concat(ownerUser || []);
  }

  getChannelNameAndServerName(channelId: string): { serverName: string; channelName: string } | null {
    const channel = this.getChannel(channelId);
    if (channel) {
      const server = this.getServer(channel.serverId);
      if (server) {
        return {
          serverName: server.name,
          channelName: channel.name,
        };
      }
    }
    return null;
  }

  getInviteFriendList(channelId: string) {
    const members = this.getChannelMembers(channelId);
    const friends = this.friends
      .map((friend) => this.users.find((user) => user.id === friend.id))
      .filter((friend) => !!friend) as User[];
    return friends.filter((friend) => !members.some((member) => member.id === friend?.id));
  }

  getMutualServers(opponentId: string): Server[] {
    if (!this.user) {
      return [];
    }
    const opponent = this.users.find((op) => op.id === opponentId);
    if (!opponent) {
      return [];
    }
    const userServers: Server[] = this.servers;
    const opponentOwnServers: Server[] = this.allServers.filter((server) => server.owner.id === opponentId);
    const opponentInviteServerIDs: string[] = opponent.invitesToChannels.map((channel) => channel.serverId);
    const opponentInviteServers = this.allServers.filter((server) => opponentInviteServerIDs.includes(server.id));
    const opponentServers = opponentOwnServers.concat(opponentInviteServers);

    return userServers.filter((userServer) =>
      opponentServers.some((opponentServer) => opponentServer.id === userServer.id)
    );
  }

  async fetchCurrentUser(): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http.get<{ user: User }>(`/users/${this.user.id}`).catch((err) => console.error(err));
    if (response) {
      this.user = response.data.user;
    }
  }

  async fetchUsers(): Promise<void> {
    const response = await http.get<{ users: User[] | null }>('/users');
    if (response) {
      this.users = response.data.users || [];
    } else {
      this.users = users;
    }
  }

  async fetchFriends(): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http
      .get<{ friends: User[] }>(`/users/${this.user.id}/friends`)
      .catch((err) => console.error(err));
    if (response) {
      this.friends = response.data.friends;
    }
  }

  async fetchInvitedToFriends(): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http
      .get<{ invitedToFriends: User[] }>(`/users/${this.user.id}/invited-to-friends`)
      .catch((err) => console.error(err));
    if (response) {
      this.invitedToFriends = response.data.invitedToFriends;
    }
  }

  async fetchInvitedFromFriends(): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http
      .get<{ invitedFromFriends: User[] }>(`/users/${this.user.id}/invited-from-friends`)
      .catch((err) => console.error(err));
    if (response) {
      console.log(response);
      this.invitedFromFriends = response.data.invitedFromFriends;
    }
  }

  async fetchChats(userId: User['id']): Promise<void> {
    const response = await http.get<{ chats: Chat[] }>(`/chats/users/${userId}`);
    console.log(response);
    if (response) {
      this.chats = response.data.chats || [];
    } else {
      this.chats = chats;
    }
  }

  async fetchChat(userOneId: string, userTwoId: string): Promise<void> {
    const response = await http.get<{ chat: Chat }>(`/chats/users/${userOneId}/${userTwoId}`);
    if (response) {
      this.chats.forEach((chat, i) => {
        if (chat.userId === userTwoId) {
          console.log('updating chat', chat.userId, response.data.chat);
          this.chats[i] = response.data.chat;
          this.onChatUpdate(response.data.chat);
        }
      });
    }
  }

  async fetchPersonalMessages(userOneId: string, userTwoId: string): Promise<void> {
    const response = await http.get<{ messages: PersonalMessage[] }>(`/chats/messages/${userOneId}/${userTwoId}`);
    if (response) {
      this.personalMessages = response.data.messages || [];
    } else {
      this.personalMessages = [];
    }
    this.onPersonalMessageListChanged(this.getFormattedRenderedPersonalMessages());
  }

  async fetchChannelMessages(channelId: string): Promise<void> {
    const response = await http.get<{ messages: ChannelMessage[] }>(`/channels/${channelId}/messages`);
    console.log(response);
    if (response) {
      this.channelMessages = response.data.messages || [];
    } else {
      this.channelMessages = [];
    }
    this.onChannelMessageListChanged(this.getFormattedRenderedChannelMessages(), this.channelInvites);
  }

  async fetchAllServers(): Promise<void> {
    const response = await http.get<{ servers: Server[] }>(`/servers`);
    if (response) {
      this.allServers = response.data.servers || [];
    } else {
      this.allServers = [];
    }
  }

  async fetchUserRelatedServers(userId: string): Promise<void> {
    console.log('fetching related sservers');
    const response = await http
      .get<{ servers: Server[] }>(`/users/${userId}/related-servers`)
      .catch((err) => console.error(err));
    if (response) {
      this.servers = response.data.servers || [];
    } else {
      this.servers = [];
    }
    this.onServerListChanged(this.servers);
  }

  async fetchChannels(serverId: string): Promise<void> {
    const response = await http
      .get<{ channels: Channel[] }>(`/servers/${serverId}/channels`)
      .catch((error) => console.error(error));
    if (response) {
      this.channels = response.data.channels || [];
    } else {
      this.channels = [];
    }
    this.onChannelListChanged(this.channels);
  }

  resetChannels(): void {
    this.channels = [];
  }

  async fetchChannelInvites(channelId: string): Promise<void> {
    const response = await http
      .get<{ invites: ChannelInvite[] }>(`/channels/${channelId}/invites`)
      .catch((error) => console.error(error));
    if (response) {
      this.channelInvites = response.data.invites || [];
    } else {
      this.channelInvites = [];
    }
  }

  async searchUsers(value: string): Promise<User[]> {
    const response = await http
      .get<{ users: User[] }>(`/users/search?search=${value}`)
      .catch((error) => console.error(error));
    if (response) {
      return response.data.users;
    }
    return [];
  }

  async checkAuth(): Promise<boolean> {
    const response = await http.get<{ user: User | null }>('/users/check-auth').catch((error) => console.error(error));
    if (response) {
      this.user = response.data.user;
      return this.isAuth;
    }
    return false;
  }

  async logIn(email: string, password: string, onUnauthorized: (error: LoginError) => void): Promise<void> {
    const response = await http
      .post<{ email: string; password: string }, { data: { user: User } }>('/users/login', { email, password })
      .catch((error) => {
        console.log(error);
        if (isExpressError<{ message: string }>(error) && error.status === ErrorStatusCode.Unauthorized) {
          onUnauthorized(error);
        }
      });
    if (response) {
      this.user = response.data.user;
    } else {
      // TODO: REMOVE THIS LINE BEFORE PRODUCTION!
      this.user = users.find((user) => email === user.email) || users[0];
    }
  }

  async register(
    { email, password, name }: { email: string; password: string; name: string },
    onSuccess: () => void,
    onUnauthorized: (error: RegisterError) => void
  ): Promise<void> {
    const response = await http
      .post<{ email: string; password: string; name: string }, { data: { user: User } }>('/users/register', {
        email,
        password,
        name,
      })
      .catch((error) => {
        console.log(error);
        if (isExpressError<RegisterErrorData>(error) && error.status === ErrorStatusCode.Unauthorized) {
          onUnauthorized(error);
        }
      });
    if (response) {
      this.user = response.data.user;
      onSuccess();
    }
  }

  async logOut(): Promise<void> {
    const response = await http.get('/users/logout').catch((err) => console.error(err));
    if (response) {
      this.user = null;
    } else {
      console.error('Something really odd happened');
    }
  }

  async updateUser(
    userId: string,
    data: Partial<User<'formData'>>,
    params?: { remove: (keyof User)[] }
  ): Promise<void> {
    const response = await http
      .patch<Partial<User<'formData'>>, { data: { user: User } }>(`/users/${userId}`, data, { params })
      .catch((err) => console.log(err));
    if (response) {
      const userIdx = this.users.findIndex(({ id }) => userId === id);
      if (userIdx !== undefined) {
        this.users = [...this.users.slice(0, userIdx), response.data.user, ...this.users.slice(userIdx + 1)];
      }
    }
  }

  async createChat(userIDs: string[]): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http
      .post(`/chats/users/${this.user.id}`, { userId: userIDs[0] })
      .catch((err) => console.error(err));
    if (response) {
      await this.fetchChats(this.user.id);
    }
    this.onChatListChanged(this.chats);
  }

  async deleteChat(userId: string): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http.delete(`/chats/users/${this.user.id}/${userId}`).catch((err) => console.error(err));
    if (response) {
      this.chats = this.chats.filter(({ userId: chatUserId }) => chatUserId !== userId);
      console.log(this.chats);
      this.onChatListChanged(this.chats);
    }
  }

  async addPersonalMessage(message: IncomingPersonalMessage): Promise<void> {
    await http.post('/personal-messages', message).catch((error) => console.error(error));
    this.onPersonalMessageListChanged(this.getFormattedRenderedPersonalMessages());
  }

  async editPersonalMessage(id: string, message: string): Promise<void> {
    const response = await http
      .patch<{ message: string }, { data: { message: PersonalMessage } }>(`/personal-messages/${id}`, { message })
      .catch((error) => console.error(error));
    if (response) {
      const messageIdx = this.personalMessages.findIndex(({ id: itemId }) => itemId === id);
      if (messageIdx) {
        this.personalMessages = [
          ...this.personalMessages.slice(0, messageIdx),
          response.data.message,
          ...this.personalMessages.slice(messageIdx + 1),
        ];
        this.onPersonalMessageChanged(this.getFormattedRenderedPersonalMessage(response.data.message));
      }
    }
  }

  async deletePersonalMessage(id: string): Promise<void> {
    const response = await http.delete(`/personal-messages/${id}`).catch((error) => console.error(error));
    if (response) {
      this.personalMessages = this.personalMessages.filter(({ id: currId }) => currId !== id);
      this.onPersonalMessageDeleted();
    }
  }

  async addChannelMessage(message: IncomingChannelMessage): Promise<ChannelMessage | null> {
    const response = await http
      .post<IncomingChannelMessage, { data: { channelMessage: ChannelMessage } }>('/channels/messages', message)
      .catch((error) => console.error(error));
    if (response) {
      return response.data.channelMessage;
    }
    return null;
  }

  async editChannelMessage(id: string, message: string): Promise<void> {
    const response = await http
      .patch<{ message: string }, { data: { message: ChannelMessage } }>(`/channels/messages/${id}`, { message })
      .catch((error) => console.error(error));
    if (response) {
      const messageIdx = this.channelMessages.findIndex(({ id: itemId }) => itemId === id);
      if (messageIdx) {
        this.channelMessages = [
          ...this.channelMessages.slice(0, messageIdx),
          response.data.message,
          ...this.channelMessages.slice(messageIdx + 1),
        ];
        this.onChannelMessageChanged(this.getFormattedRenderedChannelMessage(response.data.message));
      }
    }
  }

  async deleteChannelMessage(id: string): Promise<void> {
    const response = await http.delete(`/channels/messages/${id}`).catch((error) => console.error(error));
    if (response) {
      this.channelMessages = this.channelMessages.filter(({ id: currId }) => currId !== id);
      this.onChannelMessageDeleted();
    }
  }

  async addServer(server: Partial<Server<'formData'>>): Promise<Server | null> {
    if (!this.user) {
      return null;
    }
    const response = await http
      .post<Partial<Server<'formData'>>, { data: { server: Server } }>('/servers', server, {
        headers: {
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data; charset=utf-8',
        },
      })
      .catch((error) => console.error(error));
    if (response) {
      await Promise.all([await this.fetchUserRelatedServers(this.user.id), await this.fetchAllServers()]);
      this.onServerListChanged(this.servers);
      return response.data.server;
    }
    return null;
  }

  async addChannel(channel: Pick<Channel, 'name' | 'serverId'>, serverId: string): Promise<Channel | null> {
    const response = await http
      .post<Pick<Channel, 'name' | 'serverId'>, { data: { channel: Channel } }>('/channels', channel)
      .catch((error) => console.error(error));
    if (response) {
      const channel = response.data.channel;
      await this.fetchChannels(serverId);
      return channel;
    }
    return null;
  }

  async addChannelInvite(data: Partial<ChannelInvite>) {
    const response = await http
      .post<Partial<ChannelInvite>, { data: { invite: ChannelInvite } }>('/channels/invites', data)
      .catch((err) => console.error(err));
    console.log(response);
  }

  updateChatLocally(chatId: Chat['userId'], data: Partial<Pick<Chat, 'userName' | 'availability'>>) {
    let chat = this.chats.find(({ userId }) => userId === chatId);
    if (chat) {
      chat = { ...chat, ...data };
      Object.entries(this.onChatLocallyUpdate).forEach(([_, callback]) => callback(chat as Chat));
    }
  }

  onServerListChanged = (servers: Server[]): void => {};
  onSigningIn = (data: FormData): void => {};
  onPersonalMessageListChanged = (messages: RenderedPersonalMessage[]): void => {};
  onChannelMessageListChanged = (messages: RenderedChannelMessage[], invites: ChannelInvite[]): void => {};
  onChatLocallyUpdate: Record<'appbar' | 'sidebar' | 'main-content' | 'infobar', (chat: Chat) => void> = {
    appbar: (chat: Chat) => {},
    sidebar: (chat: Chat) => {},
    infobar: (chat: Chat) => {},
    'main-content': (chat: Chat) => {},
  };
  onChatListChanged = (chats: Chat[]): void => {};
  onChannelListChanged = (channels: Channel[]): void => {};
  onChatUpdate = (chat: Chat): void => {};
  onPersonalMessageChanged = (message: RenderedPersonalMessage): void => {};
  onPersonalMessageDeleted = (): void => {};
  onChannelMessageChanged = (message: RenderedChannelMessage): void => {};
  onChannelMessageDeleted = (): void => {};

  async bindServerListChanged(callback: (servers: Server[]) => void): Promise<void> {
    this.onServerListChanged = callback;
  }

  bindChannelListChanged(callback: (channels: Channel[]) => void): void {
    this.onChannelListChanged = callback;
  }

  bindSigningIn(callback: (data: FormData) => void): void {
    this.onSigningIn = callback;
  }

  bindPersonalMessageListChanged = (callback: (messages: RenderedPersonalMessage[]) => void): void => {
    this.onPersonalMessageListChanged = callback;
  };

  bindPersonalMessageChanged = (callback: (message: RenderedPersonalMessage) => void): void => {
    this.onPersonalMessageChanged = callback;
  };

  bindPersonalMessageDeleted = (callback: () => void): void => {
    this.onPersonalMessageDeleted = callback;
  };

  bindChannelMessageListChanged = (
    callback: (messages: RenderedChannelMessage[], invites: ChannelInvite[]) => void
  ): void => {
    this.onChannelMessageListChanged = callback;
  };

  bindChannelMessageChanged = (callback: (message: RenderedChannelMessage) => void): void => {
    this.onChannelMessageChanged = callback;
  };

  bindChannelMessageDeleted = (callback: () => void): void => {
    this.onChannelMessageDeleted = callback;
  };

  bindChatLocallyUpdate = (
    name: 'appbar' | 'sidebar' | 'main-content' | 'infobar',
    callback: (chat: Chat) => void
  ): void => {
    this.onChatLocallyUpdate[name] = callback;
  };

  bindChatListChanged = (callback: (chats: Chat[]) => void): void => {
    this.onChatListChanged = callback;
  };

  bindChatUpdate = (callback: (chat: Chat) => void): void => {
    this.onChatUpdate = callback;
  };

  getFormattedRenderedPersonalMessages(): RenderedPersonalMessage[] {
    return this.personalMessages.map((message) => {
      return this.getFormattedRenderedPersonalMessage(message);
    });
  }

  getFormattedRenderedPersonalMessage({
    id,
    fromUserId,
    date,
    message,
    responsedToMessage,
  }: PersonalMessage): RenderedPersonalMessage {
    const user = this.users.find((user) => user.id === fromUserId);
    const responsedUser = this.users.find((user) => user.id === responsedToMessage?.fromUserId);
    return {
      id,
      userId: fromUserId,
      username: user?.name || '',
      date: moment(date).calendar(),
      message,
      responsedToMessage: responsedToMessage
        ? {
            id: responsedToMessage.id,
            userId: responsedToMessage.fromUserId,
            username: responsedUser?.name || '',
            date: moment(responsedToMessage.date).calendar(),
            message: responsedToMessage.message,
            responsedToMessage: null,
          }
        : null,
    };
  }

  getFormattedRenderedChannelMessages(): RenderedChannelMessage[] {
    return this.channelMessages.map((message) => {
      return this.getFormattedRenderedChannelMessage(message);
    });
  }

  getFormattedRenderedChannelMessage({
    id,
    userId,
    service,
    channelId,
    date,
    message,
    responsedToMessage,
  }: ChannelMessage): RenderedChannelMessage {
    const user = this.users.find((user) => user.id === userId);
    // const channel = this.channels.find((channel) => channel.id === channelId);
    const responsedUser = this.users.find((user) => user.id === responsedToMessage?.userId);
    return {
      id,
      service,
      userId,
      username: user?.name || '',
      date: moment(date).calendar(),
      message,
      responsedToMessage: responsedToMessage
        ? {
            id: responsedToMessage.id,
            service,
            userId: responsedToMessage.userId,
            username: responsedUser?.name || '',
            date: moment(responsedToMessage.date).calendar(),
            message: responsedToMessage.message,
            responsedToMessage: null,
          }
        : null,
    };
  }

  private constructor() {
    AppStore.instance = this;
  }

  static get Instance() {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }
}

export default AppStore;

export const appStore = AppStore.Instance;
