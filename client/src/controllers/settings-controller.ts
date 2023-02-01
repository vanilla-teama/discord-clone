import Controller from '../lib/controller';

class SettingsController extends Controller {
  constructor() {
    super();
  }

  index(): void {
    console.log('We are in settings');
  }

  error(): void {
    console.error('error');
  }
}

export default SettingsController;
