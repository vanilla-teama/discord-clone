import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';
import * as urlEng from '../assets/flags/flag-eng.png';
import * as urlUkr from '../assets/flags/flag-ukr.png';
import * as urlRus from '../assets/flags/flag-rus.png';
class SettingsLanguageView extends View {
  static readonly classNames = {
    form: 'form-language',
    img: 'flag-settings',
    container: 'container-settings',
    title: 'lang-title',
    choise: 'lang-title-choise',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsLanguageView.throwNoRootInTheDomError('Settings-Language');
    }
    super($root);
  }
  build(): void {
    const $form = $('form', SettingsLanguageView.classNames.form);
    const $langTitle = Object.assign($('div', SettingsLanguageView.classNames.title), { textContent: 'Язык' });
    const $langTitleChoise = Object.assign($('div', SettingsLanguageView.classNames.choise), {
      textContent: 'Выберите язык',
    });
    const $contInputEng = $('div');
    const $contEng = $('div', SettingsLanguageView.classNames.container);
    const $inputEng = Object.assign($('input'), { id: 'english', type: 'radio', name: 'radio-group' });
    const $labelEng = Object.assign($('label'), { htmlFor: 'english', textContent: 'English' });
    const $flagEng = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlEng.default });
    const $contInputUkr = $('div');
    const $contUkr = $('div', SettingsLanguageView.classNames.container);
    const $inputUkr = Object.assign($('input'), { id: 'ukraine', type: 'radio', name: 'radio-group' });
    const $labelUkr = Object.assign($('label'), { htmlFor: 'ukraine', textContent: 'Українська' });
    const $flagUkr = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlUkr.default });
    const $contInpuRus = $('div');
    const $contRus = $('div', SettingsLanguageView.classNames.container);
    const $inputRus = Object.assign($('input'), { id: 'rus', type: 'radio', name: 'radio-group' });
    const $labelRus = Object.assign($('label'), { htmlFor: 'rus', textContent: 'Русский' });
    const $flagRus = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlRus.default });
    $contInputEng.append($inputEng, $labelEng);
    $contEng.append($contInputEng, $flagEng);
    $contInputUkr.append($inputUkr, $labelUkr);
    $contUkr.append($contInputUkr, $flagUkr);
    $contInpuRus.append($inputRus, $labelRus);
    $contRus.append($contInpuRus, $flagRus);
    $form.append($contEng, $contUkr, $contRus);
    this.$container.append($langTitle, $langTitleChoise, $form);
  }
}

export default SettingsLanguageView;
