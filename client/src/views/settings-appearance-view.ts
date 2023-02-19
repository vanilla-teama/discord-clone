import View from '../lib/view';
import { $ } from '../utils/functions';
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
    const $appcontainer = $('div', SettingsAppearanceView.classNames.containerMain);
    const $mainTitle = Object.assign($('div', SettingsAppearanceView.classNames.title), { textContent: 'Внешний вид' });
    const $containerTheme = $('div', SettingsAppearanceView.classNames.container);
    const $titleTheme = Object.assign($('div', SettingsAppearanceView.classNames.titleChild), {
      textContent: 'Тема',
    });
    const $containerThemeLight = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeLight = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelThemeLight = Object.assign($('label'), { htmlFor: 'light', textContent: 'Светлая' });
    $containerThemeLight.append($inputThemeLight, $labelThemeLight);
    const $containerThemeDark = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeDark = Object.assign($('input'), {
      id: 'dark',
      type: 'radio',
      name: 'radio-theme',
      checked: true,
    });
    const $labelThemeDark = Object.assign($('label'), { htmlFor: 'dark', textContent: 'Темная' });
    $containerThemeDark.append($inputThemeDark, $labelThemeDark);
    const $containerThemeSinhronization = $('div', SettingsAppearanceView.classNames.containerChild);
    const $inputThemeSinhronization = Object.assign($('input'), { id: 'sing', type: 'radio', name: 'radio-theme' });
    const $labelThemeSinhronization = Object.assign($('label'), {
      htmlFor: 'sing',
      textContent: 'Синхронизация с компьютером',
    });
    $containerThemeSinhronization.append($inputThemeSinhronization, $labelThemeSinhronization);
    $containerTheme.append($titleTheme, $containerThemeLight, $containerThemeDark, $containerThemeSinhronization);
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

    $inputThemeLight.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) document.body.setAttribute('light', '');
    });
    $inputThemeDark.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) document.body.removeAttribute('light');
    });

    $containerMessCompact.append($inputMessCompact, $labelMessCompact);
    $containerMessage.append($titleMessage, $containerMessModern, $containerMessCompact);
    $appcontainer.append($mainTitle, $containerTheme, $containerMessage);
    this.$container.append($appcontainer);
  }
}

export default SettingsAppearanceView;
