import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import SettingsSidebarView from '../views/settings-sidebar-view';
import ChatsScreen from './chats-screen';
import Screen from './screen';
import ServersScreen from './servers-screen';

class SettingsSidebarComponent extends Controller<SettingsSidebarView> {
  static instance: SettingsSidebarComponent;
  constructor() {
    super(new SettingsSidebarView());
    SettingsSidebarComponent.instance = this;
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.toggleActiveStatus(new Router().getParams()[0]);
    this.view.bindLogout(this.logOut);
  }

  logOut: EventListener = async () => {
    if (appStore.user) {
      const userId = appStore.user.id;
      await appStore.logOut();
      if (!appStore.isAuth) {
        socket.emit('userLoggedOut', { userId });
        SettingsSidebarComponent.clearComponentsData();
        Router.push(RouteControllers.Start);
      }
    }
  };

  static clearComponentsData() {
    ChatsScreen.chat = null;
    ServersScreen.server = null;
    ServersScreen.channel = null;
  }
}

export default SettingsSidebarComponent;
