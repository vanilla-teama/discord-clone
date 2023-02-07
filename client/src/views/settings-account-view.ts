import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsContentView from './settings-content-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAccountView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAccountView.throwNoRootInTheDomError('Settings-Account');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS ACCOUNT!');
  }
}

export default SettingsAccountView;
