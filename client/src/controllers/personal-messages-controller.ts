import Controller from '../lib/controller';
import ChatsView from '../views/personal-messages/chats';

class PersonalMessagesController extends Controller {
  constructor() {
    super();
  }

  index(): void {
    console.log('index');
  }

  chats(): void {
    const chatsView = new ChatsView('Chats');
    chatsView.render();
  }

  friends(): void {
    console.log('We are in friends');
  }

  error(): void {
    console.error('error');
  }
}

export default PersonalMessagesController;
