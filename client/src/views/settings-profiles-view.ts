import * as plus from '../assets/icons/plus.svg';
import * as upload from '../assets/icons/upload.svg';
import * as discord from '../assets/icons/discord.svg';
import View from '../lib/view';
import { $, base64Url, capitalize, readImage } from '../utils/functions';
import ModalView from './modal-view';
import SettingsScreenView from './settings-screen-view';
import { Profile } from '../types/entities';
import { translation } from '../utils/lang';

export interface ProfileChanges {
  avatar: File | null | undefined;
  banner: string | null | undefined;
  about: string | null | undefined;
}

export const defaultBanner = '#5865F2';

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

  // If we set avatar to null we set it to null in database on save
  // If avatar remains undefined we don't change avatar in database
  // If we set avatar to File we save it as a new image to database
  newProfile: ProfileChanges;
  currentProfile: Profile;
  name: string;

  $changeControl: HTMLDivElement;
  $bannerExample: HTMLDivElement;
  $avatarExample: HTMLImageElement;
  $nameExample: HTMLDivElement;
  $aboutExample: HTMLTextAreaElement;
  $aboutExampleContainer: HTMLDivElement;
  $bannerInput: HTMLInputElement;
  $aboutInput: HTMLTextAreaElement;
  $profileExample: HTMLDivElement;

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsProfilesView.throwNoRootInTheDomError('Settings-Profiles');
    }
    super($root);
    this.$changeControl = $('div', 'settings-profile__change-control change-control');
    this.$avatarExample = $('img', 'chats-info-bar__avatar');
    this.$nameExample = $('div', 'content-info__user-name');
    this.$bannerExample = $('div', 'chats-info-bar__header');
    this.$aboutExample = $('textarea', 'content-info__note-input');
    this.$aboutInput = $('textarea', 'settings-profile__about-input');
    this.$aboutExampleContainer = $('div', 'content-info__note-block');
    this.$bannerInput = $('input', SettingsProfilesView.classNames.inputColor);
    this.$profileExample = this.createProfileExample();
    this.currentProfile = {
      about: null,
      avatar: null,
      banner: null,
    };
    this.newProfile = {
      about: undefined,
      avatar: undefined,
      banner: undefined,
    };
    this.name = '';
  }
  build(): void {
    const __ = translation();
    const $containerProfile = $('div', SettingsProfilesView.classNames.containerProfile);
    const $titleMain = Object.assign($('div', SettingsProfilesView.classNames.titleMain), {
      textContent: __.settings.profile.heading,
    });
    const $leftSection = $('div', SettingsProfilesView.classNames.leftSection);
    const $profileExample = this.$profileExample;
    const $sectionAvatarChange = $('div', SettingsProfilesView.classNames.customizeSection);
    const $titleAvatar = Object.assign($('div', SettingsProfilesView.classNames.titleAvatar), {
      textContent: __.settings.profile.avatar,
    });
    const $buttonAvatar = Object.assign($('button', SettingsProfilesView.classNames.buttonAvatar), {
      textContent: __.settings.profile.changeAvatar,
    });
    $sectionAvatarChange.append($titleAvatar, $buttonAvatar);
    const $sectionColorChange = $('div', SettingsProfilesView.classNames.sectionColorChange);
    const $titleColor = Object.assign($('div', SettingsProfilesView.classNames.titleColor), {
      textContent: __.settings.profile.bannerColor,
    });
    const $inputColor = this.$bannerInput;
    $inputColor.type = 'color';

    $sectionColorChange.append($titleColor, $inputColor);

    const $sectionAboutChange = $('div', 'settings-profile__about-change-container');
    const $aboutTitle = $('div', 'settings-profile__about-change-title');
    const $aboutInput = this.$aboutInput;
    $aboutTitle.textContent = __.settings.profile.about;

    $sectionAboutChange.append($aboutTitle, $aboutInput);

    $leftSection.append($sectionAvatarChange, $sectionColorChange, $sectionAboutChange);
    const $blockSettingProfile = $('div', SettingsProfilesView.classNames.blockSettingProfile);
    const $imgBody = $('div', SettingsProfilesView.classNames.imgBody);
    const $titleSettingsBody = Object.assign($('div', SettingsProfilesView.classNames.titleSettingsBody), {
      textContent: 'User Profile',
    });
    $blockSettingProfile.append($imgBody, $titleSettingsBody);
    $blockSettingProfile.append($imgBody, $titleSettingsBody);
    $containerProfile.append($leftSection, $profileExample);

    this.bindAvatarButtonClick($buttonAvatar);
    this.bindBannerChange($inputColor);
    this.bindAboutChange($aboutInput);

    this.$container.append($titleMain, $containerProfile, this.$changeControl);
  }

  createProfileExample(): HTMLDivElement {
    const __ = translation();
    const $chatsInfoBar = $('div', 'chats-info-bar');
    const $bannerExample = this.$bannerExample;
    const $avatar = this.$avatarExample;
    const $status = 'Online';
    // $avatar.append($status);
    $bannerExample.append($avatar);
    this.setBannerExampleColor(defaultBanner);

    $avatar.src = discord.default;

    const $content = $('div', ['chats-info-bar__content', 'content-info']);
    const $userName = this.$nameExample;
    const $sinceBlock = $('div', 'content-info__since-block');
    const $sinceTitle = $('div', 'content-info__since-title');
    $sinceTitle.textContent = __.common.discordMemberSince;
    const $sinceDate = $('div', 'content-info__since-date');
    $sinceDate.textContent = 'MMMM D, YYYY';
    const $aboutBlock = this.createAboutExample();

    $sinceBlock.append($sinceTitle, $sinceDate);
    $content.append($userName, $sinceBlock, $aboutBlock);
    $chatsInfoBar.append($bannerExample, $content);

    return $chatsInfoBar;
  }

  createAboutExample(): HTMLDivElement {
    const __ = translation();
    const $aboutBlock = this.$aboutExampleContainer;
    $aboutBlock.innerHTML = '';
    const $noteTitle = $('div', 'content-info__note-title');
    $noteTitle.textContent = __.settings.profile.about;
    const $aboutExample = this.$aboutExample;

    $aboutBlock.append($noteTitle, $aboutExample);
    return $aboutBlock;
  }

  createAvatarForm(): HTMLFormElement {
    const __ = translation();
    const $form = $('form', ['form-avatar', 'form', 'form_white']);
    const $fileInput = $('input');
    const $applyButton = $('button', 'form-avatar__submit');

    $form.enctype = 'multipart/form-data';

    const $title = $('h3', ['form__title', 'form-avatar__title']);
    $title.textContent = __.settings.profile.uploadImage;

    $fileInput.type = 'file';
    $fileInput.name = 'avatar';
    $fileInput.style.display = 'none';

    $applyButton.textContent = capitalize(__.common.apply);
    $applyButton.type = 'submit';

    const $imageInputContainer = $('div', ['form__image-input-container', 'form-avatar__image-input-container']);
    const $imageInput = Object.assign($('input', 'form-avatar__input-image'), {
      name: 'avatar',
      type: 'file',
    });
    const $imageUpload = $('img', ['form-avatar__image-upload', 'form__image']);
    $imageUpload.src = upload.default;

    $imageInputContainer.append($imageInput, $imageUpload);

    this.bindAvatarChange($imageInput, $form, this.$avatarExample);

    $form.append($title, $imageInputContainer);

    return $form;
  }

  displayProfileData(profile: Profile, name: string) {
    this.$nameExample.textContent = name;
    this.$avatarExample.src = profile.avatar ? base64Url(profile.avatar) : discord.default;
    this.setBannerExampleColor(profile.banner ?? defaultBanner);

    this.displayAboutExample(profile.about);

    this.$bannerInput.value = profile.banner ?? defaultBanner;
    this.$aboutInput.value = profile.about ?? '';

    this.name = name;

    this.currentProfile = profile;
  }

  displayAboutExample(about: string | null | undefined) {
    if (about) {
      this.$aboutExampleContainer = this.createAboutExample();
      this.$aboutExample.value = about;
    } else {
      this.$aboutExampleContainer.innerHTML = '';
    }
  }

  displayAvatarForm($container: HTMLElement) {
    $container.append(this.createAvatarForm());
  }

  displayChangeControl() {
    const __ = translation();
    const $container = $('div', 'change-control__container');
    const $resetButton = $('button', 'change-control__reset');
    const $saveButton = $('button', 'change-control__save');
    const $message = $('p', 'change-control__message');

    $resetButton.textContent = capitalize(__.common.reset);
    $saveButton.textContent = capitalize(__.common.saveChanges);
    $message.textContent = __.settings.profile.changesWarning;

    $container.append($message, $resetButton, $saveButton);

    $resetButton.onclick = () => {
      this.resetChanges();
    };

    $saveButton.onclick = () => {
      this.saveChanges(this.newProfile);
      this.removeChangeControl();
    };

    this.$changeControl.innerHTML = '';
    this.$changeControl.append($container);
  }

  removeChangeControl() {
    this.$changeControl.innerHTML = '';
  }

  callChange() {
    this.displayChangeControl();
  }

  setBannerExampleColor(color: string) {
    this.$bannerExample.style.backgroundColor = color;
  }

  bindAvatarChange($input: HTMLInputElement, $form: HTMLFormElement, $container: HTMLImageElement): void {
    $input.onchange = (event) => {
      event.preventDefault();
      const formData = new FormData($form);
      const avatar = formData.get('avatar');
      if (avatar instanceof File) {
        readImage(avatar, $container);
        this.newProfile.avatar = avatar;
        ModalView.hide();
        this.callChange();
      }
    };
  }

  bindBannerChange($input: HTMLInputElement): void {
    $input.onchange = () => {
      const color = $input.value;
      this.setBannerExampleColor(color);
      this.newProfile.banner = color;
      this.callChange();
    };
  }

  bindAboutChange($input: HTMLTextAreaElement): void {
    $input.onchange = () => {
      const about = $input.value;
      this.displayAboutExample(about);
      this.newProfile.about = about;
      this.callChange();
    };
  }

  bindAvatarButtonClick($button: HTMLButtonElement): void {
    $button.onclick = this.onChangeAvatarButtonClick;
  }

  resetChanges(): void {
    this.newProfile = {
      about: undefined,
      banner: undefined,
      avatar: undefined,
    };
    this.displayProfileData(this.currentProfile, this.name);
    this.removeChangeControl();
  }

  onChangeAvatarButtonClick = async (): Promise<void> => {};

  saveChanges = async (profile: ProfileChanges): Promise<void> => {};

  bindOnChangeAvatarButtonClick = (handler: () => Promise<void>): void => {
    this.onChangeAvatarButtonClick = handler;
  };

  bindSaveChanges = (handler: (profile: ProfileChanges) => Promise<void>): void => {
    this.saveChanges = handler;
  };
}

export default SettingsProfilesView;
