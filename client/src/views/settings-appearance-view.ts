import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAppearanceView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAppearanceView.throwNoRootInTheDomError('Settings-Appearance');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS APPEARANCE!');
  }
}

export default SettingsAppearanceView;
