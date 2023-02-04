import ChatsScreen from '../components/chats-screen';
import ServersScreen from '../components/servers-screen';
import StartScreen from '../components/start-screen';
import Router from './router';

const routes = {
  start: StartScreen,
  chats: ChatsScreen,
  servers: ServersScreen,
} as const;

const isKeyOf = <T extends object>(value: unknown, obj: T): value is keyof typeof obj => (value as string) in obj;

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
    console.log('app', controller);

    try {
      if (isKeyOf(controller, routes)) {
        const prevController = App.controller;

        if (!prevController || !(prevController instanceof routes[controller])) {
          App.controller = new routes[controller]();
          App.controller.init();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default App;
