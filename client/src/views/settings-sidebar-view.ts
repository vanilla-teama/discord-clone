import Router, { RouteControllers, SettingsParams } from '../lib/router';
import View from '../lib/view';
import { $, isClosestElementOfCssClass } from '../utils/functions';
import SettingsScreenView from './settings-screen-view';

class SettingsSidebarView extends View {
  static readonly classes = {
    list: 'settings-bar__list',
    listItem: 'settings-bar__list-item',
    listItemActive: 'settings-bar__list-item_active',
  };

  itemsMap: Map<HTMLLIElement, SettingsParams>;

  constructor() {
    const $root = SettingsScreenView.$sidebar;
    if (!$root) {
      SettingsSidebarView.throwNoRootInTheDomError(`SettingsSidebar`);
    }
    super($root);
    this.itemsMap = new Map();
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

    this.itemsMap.set($myAccount, SettingsParams.Account);
    this.itemsMap.set($profiles, SettingsParams.Profiles);
    this.itemsMap.set($appearance, SettingsParams.Appearance);
    this.itemsMap.set($keybinds, SettingsParams.Keybinds);
    this.itemsMap.set($language, SettingsParams.Language);

    this.bindItemClick();
  }

  private bindItemClick() {
    this.$root.removeEventListener('click', this.itemClickHandler);
    this.$root.addEventListener('click', this.itemClickHandler);
  }

  private itemClickHandler: EventListener = (event) => {
    const $target = event.target;
    if (!isClosestElementOfCssClass<HTMLLIElement>($target, SettingsSidebarView.classes.listItem)) {
      return;
    }
    const param = this.itemsMap.get($target);
    if (!param) {
      return;
    }
    Router.push(RouteControllers.Settings, '', [param]);
  };

  toggleActiveStatus = (param: string | undefined) => {
    this.itemsMap.forEach((itemParam, $item) => {
      $item.classList.toggle(SettingsSidebarView.classes.listItemActive, itemParam === param);
    });
  };
}

export default SettingsSidebarView;
