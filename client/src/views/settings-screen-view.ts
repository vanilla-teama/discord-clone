import View from '../lib/view';
import { $ } from '../utils/functions';
import * as close from '../assets/icons/close-setting.svg';
class SettingsScreenView extends View {
  static readonly classNames = {
    btnClose: 'btn-close-settings',
    //imgBtn: 'img-close-settings',
    //containerBtn: 'container-close-btn',
    portal: 'portal',
  };

  static $sidebar: HTMLDivElement | null;
  static $content: HTMLDivElement | null;
  static $portal: HTMLDivElement | null = null;
  $closeButton: HTMLDivElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SettingsScreenView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$closeButton = $('div', SettingsScreenView.classNames.btnClose);
  }
  build(): void {
    const $btnClose = this.$closeButton;
    //const $containerBtn = $('div', SettingsScreenView.classNames.containerBtn);
    //const $imgBtn = Object.assign($('img', SettingsScreenView.classNames.imgBtn), { src: close.default });
    //$btnClose.append($imgBtn);
    //$containerBtn.append($btnClose);
    const $container = $('div', 'settings');
    SettingsScreenView.$sidebar = $('div', 'settings__sidebar');
    SettingsScreenView.$content = $('div', 'settings__content');
    SettingsScreenView.$portal = $('div', SettingsScreenView.classNames.portal);

    $container.append(SettingsScreenView.$sidebar, SettingsScreenView.$content, $btnClose);
    //$container.append(SettingsScreenView.$sidebar, SettingsScreenView.$content, $containerBtn);
    this.$container.append($container, SettingsScreenView.$portal);
  }

  bindClose(handler: EventListener) {
    this.$closeButton.onclick = handler;
  }
}

export default SettingsScreenView;
