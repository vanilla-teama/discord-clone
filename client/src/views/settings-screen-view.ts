import View from '../lib/view';
import { $ } from '../utils/functions';
import * as close from '../assets/icons/close-setting.svg';
class SettingsScreenView extends View {
  static readonly classNames = {
    btnClose: 'btn-close-settings',
    imgBtn: 'img-close-settings',
  };

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
    const $btnClose = $('div', SettingsScreenView.classNames.btnClose);
    const $imgBtn = Object.assign($('img', SettingsScreenView.classNames.imgBtn), { src: close.default });
    $btnClose.append($imgBtn);
    const $container = $('div', 'settings');
    SettingsScreenView.$sidebar = $('div', 'settings__sidebar');
    SettingsScreenView.$content = $('div', 'settings__content');

    $container.append(SettingsScreenView.$sidebar, SettingsScreenView.$content, $btnClose);
    this.$container.append($container);
  }
}

export default SettingsScreenView;
