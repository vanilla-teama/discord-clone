import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { bindEvent } from '../lib/socket';
import { appStore } from '../store/app-store';
import { Chat } from '../types/entities';
import ChatsScreenView from '../views/chats-screen-view';
import ChatsSideBarComponent from './chats-sidebar';
import MainComponent from './main';
import Screen from './screen';
import StartBarComponent from './start-bar';

class ChatsScreen extends Controller<ChatsScreenView> {
  constructor() {
    super(new ChatsScreenView());
    if (!appStore.user) {
      Router.push(RouteControllers.Start);
    }
  }

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }
    await appStore.fetchUsers();
    await appStore.fetchServers();
    await appStore.fetchPersonalMessages(appStore.user.id);
    await appStore.fetchChats(appStore.user.id);
    // Render Layout
    await new Screen().init();

    if (appStore.user) {
      this.view.displayUser(appStore.user);
    }

    new StartBarComponent().init();
    new ChatsSideBarComponent().init();
    new MainComponent().init();

    this.bindSocketEvents();
    this.maybeRedirectToFirstChat(appStore.chats);
  }

  bindSocketEvents() {
    bindEvent('userLoggedInServer', (data: unknown) => {
      console.log('Chat Screen', 'user logged In', data);
    });
  }

  private maybeRedirectToFirstChat(chats: Chat[] | null | undefined): void {
    console.log(chats);
    if (!chats || chats.length === 0) {
      return;
    }
    Router.push(RouteControllers.Chats, '', [chats[0].userId]);
  }
}

export default ChatsScreen;
