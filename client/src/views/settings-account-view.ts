import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsContentView from './settings-content-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAccountView extends View {
  static readonly classNames = {
    infoBlock: 'info-block-acount',
    infoBlockHeader: 'info-block-header-acoun',
    avatarBlockHeader: 'avatar-block-header-acoun',
    blockBody: 'block-body-acoun',
    titleBody: 'title-body-acoun',
    blockSettingProfile: 'block-setting-acoun',
    titleSettingsBody: 'title-setting-body-acoun',
    bodyButton: 'body-button-acoun',
    nickName: 'nick-name-acoun',
    buttonUserProf: 'btn-user-acoun',
    nickNameContainer: 'nick-name-container-acoun',
    mainBlock: 'main-block-account',
    titleMain: 'main-title-acount',
    buttonDelete: 'button-delete-acount',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAccountView.throwNoRootInTheDomError('Settings-Account');
    }
    super($root);
  }
  build(): void {
    const $mainBlock = $('div', SettingsAccountView.classNames.mainBlock);
    const $titleMain = Object.assign($('div', SettingsAccountView.classNames.titleMain), {
      textContent: 'Мой акаунт',
    });
    const $blocDelete = $('div');
    const $titlDelete = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'Удалить аккаунт',
    });
    const $buttonDelete = Object.assign($('button', SettingsAccountView.classNames.buttonDelete), {
      textContent: 'Удалить аккаунт',
    });
    $blocDelete.append($titlDelete, $buttonDelete);
    const $infoBlock = $('div', SettingsAccountView.classNames.infoBlock);
    const $infoBlockHeader = $('div', SettingsAccountView.classNames.infoBlockHeader);
    const $avatarBlockHeader = $('div', SettingsAccountView.classNames.avatarBlockHeader);
    $infoBlockHeader.append($avatarBlockHeader);
    const $blockBody = $('div', SettingsAccountView.classNames.blockBody);
    const $nickName = $('div', SettingsAccountView.classNames.nickName);
    $nickName.textContent = 'Alex89198900#6625';
    const $buttonUserProf = Object.assign($('button', SettingsAccountView.classNames.buttonUserProf), {
      textContent: 'Настр. профиль пользователя',
    });
    const $nickNameContainer = $('div', SettingsAccountView.classNames.nickNameContainer);
    $nickNameContainer.append($nickName, $buttonUserProf);
    const $blockName = $('div');
    const $blockSettingName = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleBodyName = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'ИМЯ ПОЛЬЗОВАТЕЛЯ',
    });
    const $titleName = Object.assign($('div', SettingsAccountView.classNames.titleBody), {
      textContent: 'Alex89198900#6625',
    });
    $blockName.append($titleBodyName, $titleName);
    const $buttonName = Object.assign($('button', SettingsAccountView.classNames.bodyButton), {
      textContent: 'Изменить',
    });
    $blockSettingName.append($blockName, $buttonName);
    const $blockMail = $('div');
    const $blockSettingMail = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleSettingsMail = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'ЭЛЕКТРОННАЯ ПОЧТА',
    });
    const $titleDesc = Object.assign($('div', SettingsAccountView.classNames.titleBody), {
      textContent: 'Укажите адрес эл почты',
    });
    const $buttonEmail = Object.assign($('button', SettingsAccountView.classNames.bodyButton), {
      textContent: 'Получить',
    });
    $blockMail.append($titleSettingsMail, $titleDesc);
    $blockSettingMail.append($blockMail, $buttonEmail);
    $blockBody.append($blockSettingName, $blockSettingMail);
    $infoBlock.append($infoBlockHeader, $nickNameContainer, $blockBody);
    $mainBlock.append($titleMain, $infoBlock, $blocDelete);
    this.$container.append($mainBlock);
  }
}

export default SettingsAccountView;
