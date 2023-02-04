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
    this.onChatListChanged(appStore.chats);
  }

  onChatListChanged = (chats: Chat[]) => {
    console.log(chats);
    this.view.displayChats(chats);
  };
}

export default ChatsSideBarComponent;
