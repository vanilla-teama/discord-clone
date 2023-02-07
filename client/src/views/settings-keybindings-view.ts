import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsKeybindingsView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsKeybindingsView.throwNoRootInTheDomError('Settings-Keybindings');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS KEYBINDINGS!');
  }
}

export default SettingsKeybindingsView;
