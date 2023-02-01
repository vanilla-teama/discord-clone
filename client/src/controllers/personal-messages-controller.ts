import Controller from '../lib/controller';
import PersonalMessageModel from '../models/personal-message';
import ServerModel from '../models/server';
import UserModel from '../models/user';
import ChatsView from '../views/personal-messages/chats';

class PersonalMessagesController extends Controller {
  constructor() {
    super();
  }

  async index(): Promise<void> {
    console.log('index');
  }

  async chats(): Promise<void> {
    const userModel = new UserModel();
    const serverModel = new ServerModel();
    const personalMessageModel = new PersonalMessageModel();

    const users = await userModel.fetchUsers();
    const servers = await serverModel.fetchServers();
    const personalMessages = await personalMessageModel.fetchPersonalMessages();

    const chatsView = new ChatsView({
      users,
      servers,
      personalMessages,
    });

    chatsView.render();
  }

  async friends(): Promise<void> {
    console.log('We are in friends');
  }

  async error(): Promise<void> {
    console.error('error');
  }
}

export default PersonalMessagesController;
