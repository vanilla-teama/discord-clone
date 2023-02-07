import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsProfilesView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsProfilesView.throwNoRootInTheDomError('Settings-Profiles');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS Profiles!');
  }
}

export default SettingsProfilesView;
