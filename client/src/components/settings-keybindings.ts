import Controller from '../lib/controller';
import SettingsKeybindingsView from '../views/settings-keybindings-view';

class SettingsKeybindingsComponent extends Controller<SettingsKeybindingsView> {
  constructor() {
    super(new SettingsKeybindingsView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default SettingsKeybindingsComponent;
