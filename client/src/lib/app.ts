import ChatsScreen from '../components/chats-screen';
import ServersScreen from '../components/servers-screen';
import SettingsScreen from '../components/settings-screen';
import StartScreen from '../components/start-screen';
import { isKeyOf } from '../utils/functions';
import Router, { RouteControllers } from './router';

const routes = {
  [RouteControllers.Start]: StartScreen,
  [RouteControllers.Chats]: ChatsScreen,
  [RouteControllers.Servers]: ServersScreen,
  [RouteControllers.Settings]: SettingsScreen,
} as const;

export type AppControllerType = ChatsScreen | ServersScreen | StartScreen | SettingsScreen;

class App {
  private static router: Router;

  private static controller: AppControllerType | null;

  static getRouter(): Router {
    return App.router;
  }

  static async run(): Promise<void> {
    App.beforeRun();
    App.router = new Router();

    const controller = App.router.getController();

    try {
      // Render content
      if (isKeyOf(controller, routes)) {
        const prevController = App.controller;

        if (!prevController || !(prevController instanceof routes[controller])) {
          App.controller = new routes[controller]();
          console.log('App.run', App.controller);
          await App.controller.init();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  static beforeRun() {
    ChatsScreen.bindRouteChanged();
  }
}

export default App;
