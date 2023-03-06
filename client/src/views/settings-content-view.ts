import View from '../lib/view';
import SettingsScreenView from './settings-screen-view';

class SettingsContentView extends View {
  static readonly classNames = {};

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsContentView.throwNoRootInTheDomError('Settings-content');
    }
    super($root);
  }
  build(): void {
    this.$container.append('I AM SETTINGS CONTENT!');
  }
}

export default SettingsContentView;
