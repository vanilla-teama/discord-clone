import Controller from '../lib/controller';
import SettingsScreenView from '../views/settings-screen-view';
import SettingsContentComponent from './settings-content';

class SettingsScreen extends Controller<SettingsScreenView> {
  constructor() {
    super(new SettingsScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    console.log('WTF BLDJAD!');
    await new SettingsContentComponent().init();
  }
}

export default SettingsScreen;
