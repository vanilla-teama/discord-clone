import ChatsScreen from '../components/chats-screen';
import Screen from '../components/screen';
import ServersScreen from '../components/servers-screen';
import StartScreen from '../components/start-screen';
import { isKeyOf } from '../utils/functions';
import Router from './router';

const routes = {
  start: StartScreen,
  // start: StartScreen,
  chats: ChatsScreen,
  servers: ServersScreen,
} as const;

export type AppControllerType = ChatsScreen | ServersScreen | StartScreen;

class App {
  private static router: Router;

  private static controller: AppControllerType | null;

  static getRouter(): Router {
    return App.router;
  }

  static async run(): Promise<void> {
    App.router = new Router();

    const controller = App.router.getController();

    try {
      // Render content
      if (isKeyOf(controller, routes)) {
        const prevController = App.controller;

        if (!prevController || !(prevController instanceof routes[controller])) {
          App.controller = new routes[controller]();
          await App.controller.init();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default App;
