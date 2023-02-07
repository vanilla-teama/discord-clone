import Controller from '../lib/controller';
import SettingsScreenView from '../views/settings-screen-view';

class SettingsScreen extends Controller<SettingsScreenView> {
  constructor() {
    super(new SettingsScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default SettingsScreen;
