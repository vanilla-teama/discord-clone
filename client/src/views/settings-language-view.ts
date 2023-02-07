import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsLanguageView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsLanguageView.throwNoRootInTheDomError('Settings-Language');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS LANGUAGE!');
  }
}

export default SettingsLanguageView;
