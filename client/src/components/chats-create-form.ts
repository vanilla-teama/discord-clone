import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Chat, User } from '../types/entities';
import ChatsCreateFormView from '../views/chats-create-form-view';
import ChatsSideBarComponent from './chats-sidebar';

class ChatsCreateFormComponent extends Controller<ChatsCreateFormView> {
  lastChatAdded: Chat['userId'] | null = null;

  constructor($root: HTMLElement) {
    super(new ChatsCreateFormView($root));
    this.lastChatAdded = null;
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindOnNavigateToFriends(this.onNavigateToFriends);
    this.onFriendListChanged(appStore.friends);
    this.view.bindFormSubmit(this.handleAddChat);
    appStore.bindChatListChanged(this.onChatListChanged);
  }

  handleAddChat = async (formData: FormData): Promise<void> => {
    const friendIDs = this.extractChat(formData);
    if (friendIDs.length === 0) {
      return;
    }
    this.lastChatAdded = friendIDs[0];
    await appStore.createChat(friendIDs);
  };

  onFriendListChanged(friends: User[]): void {
    this.view.displayFriends(friends);
  }

  onChatListChanged = (chats: Chat[]): void => {
    ChatsSideBarComponent.instance.onChatListChanged(chats);
    if (this.lastChatAdded) {
      Router.push(RouteControllers.Chats, '', [this.lastChatAdded]);
    }
  };

  private extractChat = (formData: FormData): string[] => {
    const friendIDs: User['id'][] = [];
    formData.forEach((value, key) => {
      if (key === 'friendId' && typeof value === 'string') {
        friendIDs.push(value);
      }
    });
    return friendIDs;
  };

  onNavigateToFriends = () => {
    Router.push(RouteControllers.Friends, '', ['addfriend']);
  };
}

export default ChatsCreateFormComponent;
