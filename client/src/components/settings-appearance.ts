import Controller from '../lib/controller';
import { Theme } from '../types/entities';
import { getTypedStorageItem } from '../utils/local-storage';
import SettingsAppearanceView from '../views/settings-appearance-view';

class SettingsAppearanceComponent extends Controller<SettingsAppearanceView> {
  constructor() {
    super(new SettingsAppearanceView());
  }

  async init(): Promise<void> {
    this.view.render();
  }

  static setTheme(): void {
    const savedTheme = getTypedStorageItem('theme') || 'dark';
    SettingsAppearanceView.setTheme(savedTheme);
  }
}

export default SettingsAppearanceComponent;
