import * as urlEng from '../assets/flags/flag-eng.png';
import * as urlRus from '../assets/flags/flag-rus.png';
import * as urlUkr from '../assets/flags/flag-ukr.png';
import View from '../lib/view';
import { Lang } from '../types/entities';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';
import SettingsScreenView from './settings-screen-view';
class SettingsLanguageView extends View {
  static readonly classNames = {
    form: 'form-language',
    img: 'flag-settings',
    container: 'container-settings',
    title: 'lang-title',
    choise: 'lang-title-choise',
  };

  $enInput: HTMLInputElement;
  $uaInput: HTMLInputElement;
  $ruInput: HTMLInputElement;

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsLanguageView.throwNoRootInTheDomError('Settings-Language');
    }
    super($root);
    this.$enInput = Object.assign($('input'), { id: 'english', type: 'radio', name: 'radio-group', value: 'en' });
    this.$uaInput = Object.assign($('input'), { id: 'ukraine', type: 'radio', name: 'radio-group', value: 'ua' });
    this.$ruInput = Object.assign($('input'), { id: 'rus', type: 'radio', name: 'radio-group', value: 'ru' });
  }

  build(): void {}

  createContent(): DocumentFragment {
    const __ = translation();
    const $container = document.createDocumentFragment();
    const $form = $('form', SettingsLanguageView.classNames.form);
    const $langTitle = Object.assign($('div', SettingsLanguageView.classNames.title), {
      textContent: __.settings.language.heading,
    });
    const $langTitleChoise = Object.assign($('div', SettingsLanguageView.classNames.choise), {
      textContent: __.settings.language.subheading,
    });
    const $contInputEng = $('div', 'radio-button-container');
    const $contEng = $('div', SettingsLanguageView.classNames.container);
    const $inputEng = this.$enInput;
    const $labelEng = Object.assign($('label'), { htmlFor: 'english', textContent: 'English' });
    const $flagEng = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlEng.default });
    const $contInputUkr = $('div', 'radio-button-container');
    const $contUkr = $('div', SettingsLanguageView.classNames.container);
    const $inputUkr = this.$uaInput;
    const $labelUkr = Object.assign($('label'), { htmlFor: 'ukraine', textContent: 'Українська' });
    const $flagUkr = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlUkr.default });
    const $contInpuRus = $('div', 'radio-button-container');
    const $contRus = $('div', SettingsLanguageView.classNames.container);
    const $inputRus = this.$ruInput;
    const $labelRus = Object.assign($('label'), { htmlFor: 'rus', textContent: 'Русский' });
    const $flagRus = Object.assign($('img', SettingsLanguageView.classNames.img), { src: urlRus.default });
    $contInputEng.append($inputEng, $labelEng);
    $contEng.append($contInputEng, $flagEng);
    $contInputUkr.append($inputUkr, $labelUkr);
    $contUkr.append($contInputUkr, $flagUkr);
    $contInpuRus.append($inputRus, $labelRus);
    $contRus.append($contInpuRus, $flagRus);
    $form.append($contEng, $contUkr, $contRus);

    [$inputEng, $inputUkr, $inputRus].forEach(($input) => {
      $input.onchange = async (event) => {
        const lang = $input.value;
        const langs: Lang[] = ['en', 'ua', 'ru'];
        if (lang !== langs[0] && lang !== langs[1] && lang !== langs[2]) {
          return;
        }
        this.onLangChange(lang);
      };
    });
    $container.append($langTitle, $langTitleChoise, $form);
    return $container;
  }

  selectLang(lang: Lang): void {
    this.$enInput.checked = false;
    this.$uaInput.checked = false;
    this.$ruInput.checked = false;
    if (lang === 'en') {
      this.$enInput.checked = true;
    } else if (lang === 'ua') {
      this.$uaInput.checked = true;
    } else if (lang === 'ru') {
      this.$ruInput.checked = true;
    }
  }

  async translate(): Promise<void> {
    this.$container.append(this.createContent());
    await this.render();
  }

  onLangChange = async (lang: Lang): Promise<void> => {};

  bindOnLangChange = (handler: (lang: Lang) => Promise<void>): void => {
    this.onLangChange = handler;
  };
}

export default SettingsLanguageView;
