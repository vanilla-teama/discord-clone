import { chats, users } from '../develop/data';
import { http } from '../lib/http';
import moment from '../lib/moment';
import { Channel, Chat, ChatAvailabilitiesMap, PersonalMessage, Server, User } from '../types/entities';
import { AppOmit } from '../types/utils';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';

export type IncomingPersonalMessage = AppOmit<PersonalMessage, 'id'>;

class AppStore {
  private static instance: AppStore;

  private _user: User | null = null;

  private _users: User[] = [];

  private _channels: Channel[] = [];

  private _chats: Chat[] = [];

  private _chatStatuses: ChatAvailabilitiesMap = new Map();

  // Personal messages with the opponent selected in the Chats bar and shown in the Main
  private _personalMessages: PersonalMessage[] = [];

  private _servers: Server[] = [];

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

  get servers(): Server[] {
    return this._servers;
  }

  private set servers(servers: Server[]) {
    this._servers = servers;
  }

  async fetchUsers(): Promise<void> {
    const response = await http.get<{ users: User[] | null }>('/users');
    if (response) {
      this.users = response.data.users || [];
    } else {
      this.users = users;
    }
  }

  async fetchChats(userId: User['id']): Promise<void> {
    const response = await http.get<{ chats: Chat[] }>(`/chats/users/${userId}`);
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
    console.log('fetch personal messagfes', response?.data?.messages);
    this.onPersonalMessageListChanged(this.getFormattedRenderedPersonalMessages());
  }

  async fetchServers(): Promise<void> {
    const response = await http.get<{ servers: Server[] }>(`/servers`);
    if (response) {
      this.servers = response.data.servers || [];
    } else {
      this.servers = [];
    }
  }

  async checkAuth(): Promise<boolean> {
    const response = await http.get<{ user: User | null }>('/users/check-auth').catch((error) => console.error(error));
    if (response) {
      this.user = response.data.user;
      return this.isAuth;
    }
    return false;
  }

  async logIn(email: string, password: string): Promise<void> {
    const response = await http
      .post<{ email: string; password: string }, { data: { user: User } }>('/users/login', { email, password })
      .catch((error) => console.error(error));
    if (response) {
      console.log(response);
      this.user = response.data.user;
    } else {
      this.user = users.find((user) => email === user.email) || users[0];
    }
  }

  async register(email: string, password: string, name: string): Promise<void> {
    const response = await http.post('/users/register', { email, password, name });
    console.log(response);
  }

  async logOut(): Promise<void> {
    const response = await http.get('/users/logout').catch((err) => console.error(err));
    if (response) {
      this.user = null;
    } else {
      console.error('Something really odd happened');
    }
  }

  async createChat(friendIDs: string[]): Promise<void> {
    if (!this.user) {
      return;
    }
    const response = await http
      .post(`/chats/users/${this.user.id}`, { userId: friendIDs[0] })
      .catch((err) => console.error(err));
    if (response) {
      await this.fetchChats(this.user.id);
    }
    this.onChatListChanged(this.chats);
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

  async addServer(server: Partial<Server<'formData'>>): Promise<void> {
    await http
      .post('/servers', server, {
        headers: {
          Accept: 'multipart/form-data',
          'Content-Type': 'multipart/form-data; charset=utf-8',
        },
      })
      .catch((error) => console.error(error));
    await this.fetchServers();
    this.onServerListChanged(this.servers);
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
  onChatLocallyUpdate: Record<'appbar' | 'sidebar' | 'main-content' | 'infobar', (chat: Chat) => void> = {
    appbar: (chat: Chat) => {},
    sidebar: (chat: Chat) => {},
    infobar: (chat: Chat) => {},
    'main-content': (chat: Chat) => {},
  };
  onChatListChanged = (chats: Chat[]): void => {};
  onChatUpdate = (chat: Chat): void => {};
  onPersonalMessageChanged = (message: RenderedPersonalMessage): void => {};
  onPersonalMessageDeleted = (): void => {};

  async bindServerListChanged(callback: (servers: Server[]) => void): Promise<void> {
    this.onServerListChanged = callback;
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
