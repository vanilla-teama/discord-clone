import View from '../lib/view';
import { Theme } from '../types/entities';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';
import { getTypedStorageItem, setTypedStorageItem } from '../utils/local-storage';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAppearanceView extends View {
  static readonly classNames = {
    containerChild: 'apperance-container-child',
    container: 'apperance-container',
    title: 'apperance-title',
    titleChild: 'apperance-title-child',
    containerMain: 'apperance-container-main',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAppearanceView.throwNoRootInTheDomError('Settings-Appearance');
    }
    super($root);
  }
  build(): void {
    const __ = translation();
    const savedTheme = this.getSavedTheme();
    const $appcontainer = $('div', SettingsAppearanceView.classNames.containerMain);
    const $mainTitle = Object.assign($('div', SettingsAppearanceView.classNames.title), {
      textContent: __.settings.appearance.heading,
    });
    const $containerTheme = $('div', SettingsAppearanceView.classNames.container);
    const $titleTheme = Object.assign($('div', SettingsAppearanceView.classNames.titleChild), {
      textContent: __.settings.appearance.theme,
    });
    const $containerThemeLight = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeLight = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelThemeLight = Object.assign($('label'), { htmlFor: 'light', textContent: __.settings.appearance.light });
    $containerThemeLight.append($inputThemeLight, $labelThemeLight);
    const $containerThemeDark = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeDark = Object.assign($('input'), {
      id: 'dark',
      type: 'radio',
      name: 'radio-theme',
    });
    const $labelThemeDark = Object.assign($('label'), { htmlFor: 'dark', textContent: __.settings.appearance.dark });
    $containerThemeDark.append($inputThemeDark, $labelThemeDark);
    const $containerThemeSinhronization = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeSinhronization = Object.assign($('input'), {
      id: 'sing',
      type: 'radio',
      name: 'radio-theme',
    });
    const $labelThemeSinhronization = Object.assign($('label'), {
      htmlFor: 'sing',
      textContent: 'Синхронизация с компьютером',
    });
    $containerThemeSinhronization.append($inputThemeSinhronization, $labelThemeSinhronization);
    $containerTheme.append($titleTheme, $containerThemeLight, $containerThemeDark);
    const $containerMessage = $('div', SettingsAppearanceView.classNames.container);
    const $titleMessage = Object.assign($('div', SettingsAppearanceView.classNames.titleChild), {
      textContent: 'Отображение сообщений',
    });
    const $containerMessModern = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputMessModern = Object.assign($('input'), { id: 'modern', type: 'radio', name: 'radio-message' });
    const $labelMessModern = Object.assign($('label'), {
      htmlFor: 'modern',
      textContent: 'Уютно совремеено приятно для глаз',
    });
    $containerMessModern.append($inputMessModern, $labelMessModern);
    const $containerMessCompact = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputMessCompact = Object.assign($('input'), { id: 'compact', type: 'radio', name: 'radio-message' });
    const $labelMessCompact = Object.assign($('label'), {
      htmlFor: 'compact',
      textContent: 'Компактно на экране больше сообщений',
    });

    const $body = document.body;

    if (savedTheme === 'dark') {
      $inputThemeDark.checked = true;
      $inputThemeLight.checked = false;
    } else {
      $inputThemeDark.checked = false;
      $inputThemeLight.checked = true;
    }

    $inputThemeLight.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        SettingsAppearanceView.setTheme('light');
        setTypedStorageItem('theme', 'light');
      }
    };
    $inputThemeDark.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        SettingsAppearanceView.setTheme('dark');
        setTypedStorageItem('theme', 'dark');
      }
    };
    $inputThemeSinhronization.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? $body.removeAttribute('light')
          : $body.setAttribute('light', '');

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          e.matches ? $body.removeAttribute('light') : $body.setAttribute('light', '');
        });
      }
    });

    $containerMessCompact.append($inputMessCompact, $labelMessCompact);
    $containerMessage.append($titleMessage, $containerMessModern, $containerMessCompact);
    $appcontainer.append($mainTitle, $containerTheme);
    this.$container.append($appcontainer);
  }

  static setTheme(theme: Theme) {
    document.body.toggleAttribute('light', theme === 'light');
  }

  getSavedTheme(): Theme {
    return getTypedStorageItem('theme') || 'dark';
  }
}

export default SettingsAppearanceView;
