import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { Chat, User } from '../types/entities';
import ChatsSideBarView from '../views/chats-sidebar-view';

class ChatsSideBarComponent extends Controller<ChatsSideBarView> {
  constructor() {
    super(new ChatsSideBarView());
  }

  async init(): Promise<void> {
    await appStore.fetchPersonalMessages('1');
    this.view.render();
    this.onInit(appStore.user);
    this.onChatListChanged(appStore.chats);
  }

  onInit = (user: User | null): void => {
    this.view.displayUser(user);
  };

  onChatListChanged = (chats: Chat[]): void => {
    this.view.displayChats(chats);
  };
}

export default ChatsSideBarComponent;
