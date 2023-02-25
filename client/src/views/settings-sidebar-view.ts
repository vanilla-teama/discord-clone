import Router, { RouteControllers, SettingsParams } from '../lib/router';
import View from '../lib/view';
import { $, isClosestElementOfCssClass } from '../utils/functions';
import { translation } from '../utils/lang';
import SettingsScreenView from './settings-screen-view';

class SettingsSidebarView extends View {
  static readonly classes = {
    list: 'settings-bar__list',
    listItem: 'settings-bar__list-item',
    listItemActive: 'settings-bar__list-item_active',
  };

  itemsMap: Map<HTMLLIElement, SettingsParams>;
  $logOut: HTMLLIElement;

  constructor() {
    const $root = SettingsScreenView.$sidebar;
    if (!$root) {
      SettingsSidebarView.throwNoRootInTheDomError(`SettingsSidebar`);
    }
    super($root);
    this.itemsMap = new Map();
    this.$logOut = this.createLogOutItem();
  }
  async build(): Promise<void> {
    this.$container.append(this.createContent());
  }

  createContent(): DocumentFragment {
    const __ = translation();
    const $fragment = document.createDocumentFragment();
    const $list = $('ul', SettingsSidebarView.classes.list);
    const $myAccount = $('li', SettingsSidebarView.classes.listItem);
    const $profiles = $('li', SettingsSidebarView.classes.listItem);
    const $appearance = $('li', SettingsSidebarView.classes.listItem);
    const $keybinds = $('li', SettingsSidebarView.classes.listItem);
    const $language = $('li', SettingsSidebarView.classes.listItem);
    $myAccount.textContent = __.settings.items.account;
    $profiles.textContent = __.settings.items.profile;
    $appearance.textContent = __.settings.items.appearance;
    $keybinds.textContent = __.settings.items.keybinds;
    $language.textContent = __.settings.items.language;
    this.$logOut.textContent = __.settings.items.logout;
    $list.append($myAccount, $profiles, $appearance, $keybinds, $language, this.$logOut);
    $fragment.append($list);

    this.itemsMap.set($myAccount, SettingsParams.Account);
    this.itemsMap.set($profiles, SettingsParams.Profiles);
    this.itemsMap.set($appearance, SettingsParams.Appearance);
    this.itemsMap.set($keybinds, SettingsParams.Keybinds);
    this.itemsMap.set($language, SettingsParams.Language);

    this.bindItemClick();

    return $fragment;
  }

  bindLogout(handler: EventListener) {
    this.$logOut.onclick = handler;
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

  private createLogOutItem(): HTMLLIElement {
    const __ = translation();
    return Object.assign($('li', SettingsSidebarView.classes.listItem), {
      textContent: __.settings.items.logout,
    });
  }

  toggleActiveStatus = (param: string | undefined) => {
    this.itemsMap.forEach((itemParam, $item) => {
      $item.classList.toggle(SettingsSidebarView.classes.listItemActive, itemParam === param);
    });
  };
}

export default SettingsSidebarView;
