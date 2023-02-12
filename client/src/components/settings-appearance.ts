import Controller from '../lib/controller';
import SettingsAppearanceView from '../views/settings-appearance-view';

class SettingsAppearanceComponent extends Controller<SettingsAppearanceView> {
  constructor() {
    super(new SettingsAppearanceView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default SettingsAppearanceComponent;
