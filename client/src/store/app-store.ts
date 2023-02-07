import { chats, personalMessages, servers, users } from '../develop/data';
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

  get chats(): Chat[] {
    return this._chats;
  }

  get personalMessages(): PersonalMessage[] {
    return this._personalMessages;
  }

  get servers(): Server[] {
    return this._servers;
  }

  async fetchUsers(): Promise<void> {
    const response = await http.get<{ users: User[] | null }>('/users');
    if (response) {
      this._users = response.data.users || [];
    } else {
      this._users = users;
    }
    console.log(this._users);
  }

  async fetchChats(userId: User['id']): Promise<void> {
    const response = await http.get<{ chats: Chat[] }>(`/chats/users/${userId}`);
    if (response) {
      this._chats = response.data.chats || [];
    } else {
      this._chats = chats;
    }
  }

  async fetchPersonalMessages(userId: User['id']): Promise<void> {
    this._personalMessages = [];
  }

  async fetchServers(): Promise<void> {
    this._servers = servers;
  }

  async addPersonalMessage(message: IncomingPersonalMessage): Promise<void> {
    const id =
      this.personalMessages.length > 0 ? Number(this.personalMessages[this.personalMessages.length - 1].id) + 1 : 1;
    this._personalMessages = [...this._personalMessages, { ...message, id: id.toString() }];
    this.onPersonalMessageListChanged(this.getFormattedRenderedPersonalMessages());
  }

  deletePersonalMessage(id: PersonalMessage['id']): void {
    this._personalMessages = this._personalMessages.filter(({ id: currId }) => currId !== id);
  }

  async addServer(server: Server): Promise<void> {
    this._servers = [...this._servers, server];
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
      console.log(fromUserId, this.users);
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
