import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { Lang } from '../types/entities';
import { getTypedStorageItem, setTypedStorageItem } from '../utils/local-storage';
import SettingsLanguageView from '../views/settings-language-view';
import SettingsSidebarComponent from './settings-sidebar';

class SettingsLanguageComponent extends Controller<SettingsLanguageView> {
  constructor() {
    super(new SettingsLanguageView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindOnLangChange(this.onLangChange);
    await this.onLangChange(this.getSavedLang());
    this.view.selectLang(this.getSavedLang());
  }

  getSavedLang(): Lang {
    return getTypedStorageItem('lang') || 'en';
  }

  setLang(lang: Lang) {
    appStore.setLang(lang);
  }

  saveLang(lang: Lang): void {
    setTypedStorageItem('lang', lang);
  }

  onLangChange = async (lang: Lang): Promise<void> => {
    this.setLang(lang);
    this.saveLang(lang);
    await this.view.translate();
    await SettingsSidebarComponent.instance.init();
  };
}

export default SettingsLanguageComponent;
