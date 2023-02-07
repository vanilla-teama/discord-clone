import View from '../lib/view';
import { $ } from '../utils/functions';
import SettingsScreenView from './settings-screen-view';
class SettingsSidebarView extends View {
  static readonly classes = {
    list: 'settings-bar__list',
    listItem: 'settings-bar__list-item',
  };

  constructor() {
    const $root = SettingsScreenView.$sidebar;
    if (!$root) {
      SettingsSidebarView.throwNoRootInTheDomError(`SettingsSidebar`);
    }
    super($root);
  }
  async build(): Promise<void> {
    const $list = $('ul', SettingsSidebarView.classes.list);
    const $myAccount = $('li', SettingsSidebarView.classes.listItem);
    const $profiles = $('li', SettingsSidebarView.classes.listItem);
    const $appearance = $('li', SettingsSidebarView.classes.listItem);
    const $keybinds = $('li', SettingsSidebarView.classes.listItem);
    const $language = $('li', SettingsSidebarView.classes.listItem);
    $myAccount.textContent = 'My Account';
    $profiles.textContent = 'Profiles';
    $appearance.textContent = 'Appearance';
    $keybinds.textContent = 'Keybinds';
    $language.textContent = 'Language';
    $list.append($myAccount, $profiles, $appearance, $keybinds, $language);
    this.$container.append($list);
  }
}

export default SettingsSidebarView;
