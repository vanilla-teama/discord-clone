import Controller from '../lib/controller';
import { Chat } from '../types/entities';
import ChatsAppBarView from '../views/chats-app-bar-view';
import ChatsScreen from './chats-screen';

class ChatsAppBarComponent extends Controller<ChatsAppBarView> {
  chat: Chat | null;

  constructor() {
    super(new ChatsAppBarView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ChatsAppBarComponent;
