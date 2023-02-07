import Controller from '../lib/controller';
import SettingsScreenView from '../views/settings-screen-view';
import SettingsContentComponent from './settings-content';
import SettingsSidebarComponent from './settings-sidebar';

class SettingsScreen extends Controller<SettingsScreenView> {
  constructor() {
    super(new SettingsScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    await new SettingsSidebarComponent().init();
    await new SettingsContentComponent().init();
  }
}

export default SettingsScreen;
