import Controller from '../lib/controller';
import { Chat } from '../types/entities';
import ChatsInfoBarView from '../views/chats-info-bar-view';
import ChatsScreen from './chats-screen';

class ChatsInfoBarComponent extends Controller<ChatsInfoBarView> {
  chat: Chat | null;

  constructor() {
    super(new ChatsInfoBarView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default ChatsInfoBarComponent;
