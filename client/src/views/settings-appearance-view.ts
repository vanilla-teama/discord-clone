import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAppearanceView extends View {
  static readonly classNames = {
    container: 'apperance-contauner',
    title: 'apperance-title',
    titleChild: 'apperance-title-child',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAppearanceView.throwNoRootInTheDomError('Settings-Appearance');
    }
    super($root);
  }
  build(): void {
    const $appcontainer = $('div', SettingsAppearanceView.classNames.container);
    const $mainTitle = Object.assign($('div', SettingsAppearanceView.classNames.title), { textContent: 'Внешний вид' });
    const $containerTheme = $('div', SettingsAppearanceView.classNames.container);
    const $titleTheme = Object.assign($('div', SettingsAppearanceView.classNames.titleChild), {
      textContent: 'Тема',
    });
    const $containerThemeLight = $('div', SettingsAppearanceView.classNames.container);
    const $inputThemeLight = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelThemeLight = Object.assign($('label'), { htmlFor: 'light', textContent: 'Светлая' });
    $containerThemeLight.append($inputThemeLight, $labelThemeLight);
    const $containerThemeDark = $('div', SettingsAppearanceView.classNames.container);
    const $inputThemeDark = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelThemeDark = Object.assign($('label'), { htmlFor: 'light', textContent: 'Темная' });
    $containerThemeDark.append($inputThemeDark, $labelThemeDark);
    const $containerThemeSinhronization = $('div', SettingsAppearanceView.classNames.container);
    const $inputThemeSinhronization = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelThemeSinhronization = Object.assign($('label'), {
      htmlFor: 'light',
      textContent: 'Синхронизация с компьютером',
    });
    $containerThemeSinhronization.append($inputThemeSinhronization, $labelThemeSinhronization);
    $containerTheme.append($titleTheme, $containerThemeLight, $containerThemeDark, $containerThemeSinhronization);
    const $containerMessage = $('div', SettingsAppearanceView.classNames.container);
    const $titleMessage = Object.assign($('div', SettingsAppearanceView.classNames.titleChild), {
      textContent: 'Отображение сообщений',
    });
    const $containerMessModern = $('div', SettingsAppearanceView.classNames.container);
    const $inputMessModern = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelMessModern = Object.assign($('label'), {
      htmlFor: 'light',
      textContent: 'Уютно совремеено приятно для глаз',
    });
    $containerMessModern.append($inputMessModern, $labelMessModern);
    const $containerMessCompact = $('div', SettingsAppearanceView.classNames.container);
    const $inputMessCompact = Object.assign($('input'), { id: 'light', type: 'radio', name: 'radio-theme' });
    const $labelMessCompact = Object.assign($('label'), {
      htmlFor: 'light',
      textContent: 'Компактно на экране больше сообщений',
    });
    $containerMessCompact.append($inputMessCompact, $labelMessCompact);
    $containerMessage.append($titleMessage, $containerMessModern, $containerMessCompact);
    $appcontainer.append($mainTitle, $containerTheme, $containerMessage);
    this.$container.append($appcontainer);
  }
}

export default SettingsAppearanceView;
