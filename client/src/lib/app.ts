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
  [RouteControllers.Friends]: ChatsScreen,
} as const;

export type AppControllerType = ChatsScreen | ServersScreen | StartScreen | SettingsScreen;

class App {
  private static router: Router;

  private static controller: AppControllerType | null;

  private static controllerHistory: string[] = [];

  static getRouter(): Router {
    return App.router;
  }

  static async run(): Promise<void> {
    App.router = new Router();

    // const controller = App.router.getController();
    const controller = new Router().getController();

    try {
      // Render content
      if (isKeyOf(controller, routes)) {
        App.pushToControllerHistory(controller);
        const prevControllerObj = App.controller;

        if (!prevControllerObj || !(prevControllerObj instanceof routes[controller])) {
          App.controller = new routes[controller]();
          await App.controller.init();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  static pushToControllerHistory(controller: string) {
    const lastController = App.controllerHistory[App.controllerHistory.length - 1];
    if (lastController !== controller) {
      App.controllerHistory.push(controller);
      if (App.controllerHistory.length > 2) {
        App.controllerHistory.shift();
      }
    }
  }
}

export default App;
