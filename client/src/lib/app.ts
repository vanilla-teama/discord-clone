import PersonalMessagesController from '../controllers/personal-messages-controller';
import ServersController from '../controllers/servers-controller';
import SettingsController from '../controllers/settings-controller';
import Router, { Controllers, PersonalMessagesActions, ServersActions, SettingsActions } from './router';

class App {
  private static router: Router;

  private static personalMessagesController: PersonalMessagesController;

  private static serversController: ServersController;

  private static settingsController: SettingsController;

  static getRouter(): Router {
    return App.router;
  }

  static getPersonalMessagesController(): PersonalMessagesController {
    return App.personalMessagesController;
  }

  static getServersController(): ServersController {
    return App.serversController;
  }

  static getSettingsController(): SettingsController {
    return App.settingsController;
  }

  static async run(): Promise<void> {
    App.router = new Router();
    App.personalMessagesController = new PersonalMessagesController();
    App.serversController = new ServersController();
    App.settingsController = new SettingsController();

    const controller = App.router.getController();
    const action = App.router.getAction().toLowerCase();

    try {
      switch (controller) {
        case Controllers.PersonalMessages: {
          switch (action) {
            case PersonalMessagesActions.Index: {
              await App.personalMessagesController.index();
              break;
            }
            case PersonalMessagesActions.Chats: {
              await App.personalMessagesController.chats();
              break;
            }
            case PersonalMessagesActions.Friends: {
              await App.personalMessagesController.friends();
              break;
            }
            default: {
              throw new Error('Wrong url');
            }
          }
          break;
        }
        case Controllers.Servers: {
          switch (action) {
            case ServersActions.Index: {
              await App.serversController.index();
              break;
            }
            case ServersActions.Channels: {
              await App.serversController.channels();
              break;
            }
            default: {
              throw new Error('Wrong url');
            }
          }
          break;
        }
        case Controllers.Settings: {
          switch (action) {
            case SettingsActions.Index: {
              await App.settingsController.index();
              break;
            }
            default: {
              throw new Error('Wrong url');
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default App;
