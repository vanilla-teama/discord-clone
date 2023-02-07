import Controller from '../lib/controller';
import SettingsLanguageView from '../views/settings-language-view';

class SettingsLanguageComponent extends Controller<SettingsLanguageView> {
  constructor() {
    super(new SettingsLanguageView());
  }

  async init(): Promise<void> {
    this.view.render();
  }
}

export default SettingsLanguageComponent;
