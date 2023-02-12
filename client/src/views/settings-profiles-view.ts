import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import SettingsScreenView from './settings-screen-view';

class SettingsProfilesView extends View {
  static readonly classNames = {
    containerProfile: 'container-profile',
    leftSection: 'left-section',
    customizeSection: 'customize-section',
    sectionAvatarChange: 'section-avatar-chsnge',
    titleAvatar: 'title-avatar',
    buttonAvatar: 'button-avatar',
    sectionColorChange: 'section-color-change',
    titleColor: 'title-color',
    inputColor: 'input-color',
    infoBlock: 'info-block',
    infoBlockHeader: 'info-block-header',
    avatarBlockHeader: 'avatar-block-header',
    blockBody: 'block-body-profile',
    titleBody: 'title-body-profile',
    imgBody: 'img-body-profile',
    blockSettingProfile: 'block-setting-profile',
    titleSettingsBody: 'title-setting-body',
    bodyButton: 'body-button-profile',
    nickName: 'nick-name-profile',
    titleMain: 'title-main-profile',
  };

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsProfilesView.throwNoRootInTheDomError('Settings-Profiles');
    }
    super($root);
  }
  build(): void {
    const $containerProfile = $('div', SettingsProfilesView.classNames.containerProfile);
    const $titleMain = Object.assign($('div', SettingsProfilesView.classNames.titleMain), {
      textContent: 'Профили',
    });
    const $leftSection = $('div', SettingsProfilesView.classNames.leftSection);
    const $customizeSection = $('div', SettingsProfilesView.classNames.customizeSection);
    const $sectionAvatarChange = $('div', SettingsProfilesView.classNames.customizeSection);
    const $titleAvatar = Object.assign($('div', SettingsProfilesView.classNames.titleAvatar), {
      textContent: 'АВАТАР',
    });
    const $buttonAvatar = Object.assign($('button', SettingsProfilesView.classNames.buttonAvatar), {
      textContent: 'Смена аватара',
    });
    $sectionAvatarChange.append($titleAvatar, $buttonAvatar);
    const $sectionColorChange = $('div', SettingsProfilesView.classNames.sectionColorChange);
    const $titleColor = Object.assign($('div', SettingsProfilesView.classNames.titleColor), {
      textContent: 'Цвет банера',
    });
    const $inputColor = Object.assign($('input', SettingsProfilesView.classNames.inputColor), { type: 'color' });
    $sectionColorChange.append($titleColor, $inputColor);
    $leftSection.append($sectionAvatarChange, $sectionColorChange);
    const $infoBlock = $('div', SettingsProfilesView.classNames.infoBlock);
    const $infoBlockHeader = $('div', SettingsProfilesView.classNames.infoBlockHeader);
    const $avatarBlockHeader = $('div', SettingsProfilesView.classNames.avatarBlockHeader);
    $infoBlockHeader.append($avatarBlockHeader);
    const $blockBody = $('div', SettingsProfilesView.classNames.blockBody);
    const $nickName = $('div', SettingsProfilesView.classNames.nickName);
    $nickName.textContent = 'Alex89198900#6625';
    const $titleBody = Object.assign($('div', SettingsProfilesView.classNames.titleBody), {
      textContent: 'НАСТРОЙКА ПРОФИЛЯ',
    });
    const $blockSettingProfile = $('div', SettingsProfilesView.classNames.blockSettingProfile);
    const $imgBody = $('div', SettingsProfilesView.classNames.imgBody);
    const $titleSettingsBody = Object.assign($('div', SettingsProfilesView.classNames.titleSettingsBody), {
      textContent: 'ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ',
    });
    $blockSettingProfile.append($imgBody, $titleSettingsBody);
    const $bodyButton = Object.assign($('button', SettingsProfilesView.classNames.bodyButton), {
      textContent: 'ПРИМЕР КНОПКИ',
    });
    $blockSettingProfile.append($imgBody, $titleSettingsBody);
    $blockBody.append($nickName, $titleBody, $blockSettingProfile, $bodyButton);
    $infoBlock.append($infoBlockHeader, $blockBody);
    $customizeSection.append($infoBlock);
    $containerProfile.append($leftSection, $customizeSection);
    this.$container.append($titleMain, $containerProfile);
  }
}

export default SettingsProfilesView;
