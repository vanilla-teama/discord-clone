import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAppearanceView extends View {
  static readonly classNames = {
    container: 'apperance-contauner',
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
    const $containerTheme = $('div', SettingsAppearanceView.classNames.container);
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
    const $labelThemeSinhronization = Object.assign($('label'), { htmlFor: 'light', textContent: 'Темная' });
    $containerThemeSinhronization.append($inputThemeSinhronization, $labelThemeSinhronization);
    $containerTheme.append($containerThemeLight, $containerThemeDark, $containerThemeSinhronization);
    this.$container.append('I AM SETTINGS APPEARANCE!');
  }
}

export default SettingsAppearanceView;
