import Controller from '../lib/controller';
import SettingsAccountView from '../views/settings-account-view';

class SettingsAccountComponent extends Controller<SettingsAccountView> {
  constructor() {
    super(new SettingsAccountView());
  }

  async init(): Promise<void> {
    console.log('Settings Account Component');
    this.view.render();
  }
}

export default SettingsAccountComponent;
