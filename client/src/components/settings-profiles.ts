import Controller from '../lib/controller';
import SettingsProfilesView from '../views/settings-profiles-view';

class SettingsProfilesComponent extends Controller<SettingsProfilesView> {
  constructor() {
    super(new SettingsProfilesView());
  }

  async init(): Promise<void> {
    console.log('settings profiles');
    this.view.render();
  }
}

export default SettingsProfilesComponent;
