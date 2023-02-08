import { chats, personalMessages, users } from '../develop/data';
import { Chat, FetchedUser, PersonalMessage, Server, User } from '../types/entities';
import { AppOmit } from '../types/utils';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';
import moment from '../lib/moment';
import { http } from '../lib/http';

export type IncomingPersonalMessage = AppOmit<PersonalMessage, 'id'>;

class AppStore {
  private static instance: AppStore;

  user: User | null = null;

  private _users: User[] = [];

  private _chats: Chat[] = [];

  // Personal messages with the opponent selected in the Chats bar and shown in the Main
  private _personalMessages: PersonalMessage[] = [];

  private _servers: Server[] = [];

  get isAuth(): boolean {
    return Boolean(this.user);
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

  async fetchPersonalMessages(userOneId: string, userTwoId: string): Promise<void> {
    const response = await http.get<{ messages: PersonalMessage[] }>(`/chats/messages/${userOneId}/${userTwoId}`);
    if (response) {
      this.personalMessages = response.data.messages || [];
    } else {
      this.personalMessages = [];
    }
  }

  async fetchServers(): Promise<void> {
    const response = await http.get<{ servers: Server[] }>(`/servers`);
    if (response) {
      this.servers = response.data.servers || [];
    } else {
      this.servers = [];
    }
  }

  async addPersonalMessage(message: IncomingPersonalMessage): Promise<void> {
    await http.post('/personal-messages', message).catch((error) => console.error(error));
    this.onPersonalMessageListChanged(this.getFormattedRenderedPersonalMessages());
  }

  deletePersonalMessage(id: PersonalMessage['id']): void {
    this.personalMessages = this.personalMessages.filter(({ id: currId }) => currId !== id);
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

  onServerListChanged = (servers: Server[]) => {};
  onSigningIn = (data: FormData) => {};
  onPersonalMessageListChanged = (messages: RenderedPersonalMessage[]) => {};

  async bindServerListChanged(callback: (servers: Server[]) => void) {
    this.onServerListChanged = callback;
  }

  bindSigningIn(callback: (data: FormData) => void) {
    this.onSigningIn = callback;
  }

  bindPersonalMessageListChanged = (callback: (messages: RenderedPersonalMessage[]) => void) => {
    this.onPersonalMessageListChanged = callback;
  };

  getFormattedRenderedPersonalMessages(): RenderedPersonalMessage[] {
    return this.personalMessages.map(({ id, fromUserId, date, message }) => {
      const user = this.users.find((user) => user.id === fromUserId);
      if (!user) {
        throw Error('User not found');
      }
      return {
        id,
        username: user.name,
        date: moment(date).calendar(),
        message,
      };
    });
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
