import View from '../lib/view';
import { $ } from '../utils/functions';

class SettingsScreenView extends View {
  static readonly classNames = {};

  static $sidebar: HTMLDivElement | null;
  static $content: HTMLDivElement | null;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SettingsScreenView.throwNoRootInTheDomError('Root');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'settings');
    SettingsScreenView.$sidebar = $('div', 'settings__sidebar');
    SettingsScreenView.$content = $('div', 'settings__content');

    $container.append(SettingsScreenView.$sidebar, SettingsScreenView.$content);
    this.$container.append($container);
  }
}

export default SettingsScreenView;
