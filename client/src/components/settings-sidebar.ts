import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import SettingsSidebarView from '../views/settings-sidebar-view';

class SettingsSidebarComponent extends Controller<SettingsSidebarView> {
  constructor() {
    super(new SettingsSidebarView());
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
        Router.push(RouteControllers.Start);
      }
    }
  };
}

export default SettingsSidebarComponent;
