import Controller from '../lib/controller';

class SettingsController extends Controller {
  constructor() {
    super();
  }

  async index(): Promise<void> {
    console.log('We are in settings');
  }

  async error(): Promise<void> {
    console.error('error');
  }
}

export default SettingsController;
