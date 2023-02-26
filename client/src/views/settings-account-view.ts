import * as discord from '../assets/icons/discord.svg';
import View from '../lib/view';
import { $, base64Url, capitalize } from '../utils/functions';
import { translation } from '../utils/lang';
import ModalView from './modal-view';
import { defaultBanner } from './settings-profiles-view';
import SettingsScreenView from './settings-screen-view';

class SettingsAccountView extends View {
  static readonly classNames = {
    infoBlock: 'info-block-account',
    infoBlockHeader: 'info-block-header-account',
    avatarBlockHeader: 'avatar-block-header-account',
    blockBody: 'block-body-account',
    titleBody: 'title-body-account',
    blockSettingProfile: 'block-setting-account',
    titleSettingsBody: 'title-setting-body-account',
    bodyButton: 'body-button-account',
    nickName: 'nick-name-account',
    buttonUserProf: 'btn-user-account',
    nickNameContainer: 'nick-name-container-account',
    mainBlock: 'main-block-account',
    titleMain: 'main-title-account',
    buttonDelete: 'button-delete-account',
    nameForm: 'form-account-name',
    nameFormSubmit: 'form-account-name__submit',
    nameFormCancel: 'form-account-name__cancel',
    emailForm: 'form-account-email',
    emailFormSubmit: 'form-account-email__submit',
    emailFormCancel: 'form-account-email__cancel',
    nameInput: 'form-account-name__input',
    emailInput: 'form-account-email__input',
  };

  $avatar: HTMLImageElement;
  $bannerBlock: HTMLDivElement;
  $headingNickname: HTMLDivElement;
  $name: HTMLDivElement;
  $email: HTMLDivElement;
  $nameInput: HTMLInputElement;
  $emailInput: HTMLInputElement;

  constructor() {
    const $root = SettingsScreenView.$content;
    if (!$root) {
      SettingsAccountView.throwNoRootInTheDomError('Settings-Account');
    }
    super($root);
    this.$avatar = $('img', SettingsAccountView.classNames.avatarBlockHeader);
    this.$bannerBlock = $('div', SettingsAccountView.classNames.infoBlockHeader);
    this.$headingNickname = $('div', SettingsAccountView.classNames.nickName);
    this.$name = $('div', SettingsAccountView.classNames.titleBody);
    this.$email = $('div', SettingsAccountView.classNames.titleBody);
    this.$nameInput = $('input', SettingsAccountView.classNames.nameInput);
    this.$emailInput = $('input', SettingsAccountView.classNames.emailInput);
  }
  build(): void {
    const __ = translation();
    const $mainBlock = $('div', SettingsAccountView.classNames.mainBlock);
    const $titleMain = Object.assign($('div', SettingsAccountView.classNames.titleMain), {
      textContent: __.settings.account.heading,
    });
    const $blocDelete = $('div');
    const $titlDelete = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: __.settings.account.deleteAccount,
    });
    const $buttonDelete = Object.assign($('button', SettingsAccountView.classNames.buttonDelete), {
      textContent: __.settings.account.deleteAccount,
    });
    $blocDelete.append($titlDelete, $buttonDelete);
    const $infoBlock = $('div', SettingsAccountView.classNames.infoBlock);
    const $infoBlockHeader = this.$bannerBlock;
    const $avatarBlockHeader = this.$avatar;
    $infoBlockHeader.append($avatarBlockHeader);
    const $blockBody = $('div', SettingsAccountView.classNames.blockBody);
    const $nickName = this.$headingNickname;
    const $buttonUserProf = Object.assign($('button', SettingsAccountView.classNames.buttonUserProf), {
      textContent: __.settings.account.editUserProfile,
    });
    const $nickNameContainer = $('div', SettingsAccountView.classNames.nickNameContainer);
    $nickNameContainer.append($nickName, $buttonUserProf);
    const $blockName = $('div', 'block-setting-account-container');
    const $blockSettingName = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleBodyName = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: capitalize(__.common.username),
    });
    const $titleName = this.$name;
    $blockName.append($titleBodyName, $titleName);
    const $buttonName = $('button', SettingsAccountView.classNames.bodyButton);
    $buttonName.textContent = capitalize(__.common.edit);
    $blockSettingName.append($blockName, $buttonName);
    const $blockMail = $('div', 'block-setting-account-container');
    const $blockSettingMail = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleSettingsMail = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: capitalize(__.common.email),
    });
    const $titleDesc = this.$email;
    const $buttonEmail = $('button', SettingsAccountView.classNames.bodyButton);
    $buttonEmail.textContent = capitalize(__.common.edit);
    $blockMail.append($titleSettingsMail, $titleDesc);
    $blockSettingMail.append($blockMail, $buttonEmail);
    $blockBody.append($blockSettingName, $blockSettingMail);
    $infoBlock.append($infoBlockHeader, $nickNameContainer, $blockBody);

    const $nameForm = $('form', SettingsAccountView.classNames.nameForm);
    const $nameInput = this.$nameInput;
    const $nameButtons = $('div', 'form-account-name__buttons');
    const $nameFormSubmitButton = $('button', SettingsAccountView.classNames.nameFormSubmit);
    const $nameFormCancelButton = $('button', SettingsAccountView.classNames.nameFormCancel);
    $nameButtons.append(
      `${__.common.escapeTo} `,
      $nameFormCancelButton,
      ` • ${__.common.enterTo} `,
      $nameFormSubmitButton
    );
    $nameForm.append($nameInput, $nameButtons);
    $nameForm.style.display = 'none';
    $nameFormSubmitButton.type = 'submit';
    $nameFormSubmitButton.textContent = capitalize(__.common.save);
    $nameFormCancelButton.textContent = capitalize(__.common.cancel);

    const $emailForm = $('form', SettingsAccountView.classNames.emailForm);
    const $emailInput = this.$emailInput;
    const $emailButtons = $('div', 'form-account-name__buttons');
    const $emailFormSubmitButton = $('button', SettingsAccountView.classNames.emailFormSubmit);
    const $emailFormCancelButton = $('button', SettingsAccountView.classNames.emailFormCancel);
    $emailInput.type = 'email';
    $emailButtons.append(
      `${__.common.escapeTo} `,
      $emailFormCancelButton,
      ` • ${__.common.enterTo} `,
      $emailFormSubmitButton
    );
    $emailForm.append($emailInput, $emailButtons);

    $emailForm.style.display = 'none';
    $emailFormSubmitButton.type = 'submit';
    $emailFormSubmitButton.textContent = capitalize(__.common.save);
    $emailFormCancelButton.textContent = capitalize(__.common.cancel);

    $blockName.append($nameForm);
    $blockMail.append($emailForm);

    $mainBlock.append($titleMain, $infoBlock, $blocDelete);

    this.bindShowFormButtonClick($buttonName, $nameForm);
    this.bindShowFormButtonClick($buttonEmail, $emailForm);
    this.bindHideFormButtonClick($nameFormCancelButton, $nameForm);
    this.bindHideFormButtonClick($emailFormCancelButton, $emailForm);

    this.bindInputEscapeKey($nameInput, $nameForm);
    this.bindInputEscapeKey($emailInput, $emailForm);

    this.bindNameFormSubmit($nameForm);
    this.bindEmailFormSubmit($emailForm);

    this.bindEditUserProfileClick($buttonUserProf);
    this.bindDeleteAccountClick($buttonDelete);

    this.$container.append($mainBlock);
  }

  displayData({
    name,
    email,
    banner,
    avatar,
  }: {
    name?: string;
    email?: string;
    banner?: string | null;
    avatar?: string | null;
  }): void {
    if (name !== undefined) {
      this.$headingNickname.textContent = name;
      this.$name.textContent = name;
      this.$nameInput.value = name;
    }
    if (email !== undefined) {
      this.$email.textContent = email;
      this.$emailInput.value = email;
    }
    if (banner !== undefined) {
      this.$bannerBlock.style.backgroundColor = banner || defaultBanner;
    }
    if (avatar !== undefined) {
      this.$avatar.src = avatar ? base64Url(avatar) : discord.default;
    }
  }

  displayDeleteConfirmDialog($container: HTMLElement): void {
    const __ = translation();
    const $deleteContainer = $('div', 'chat__delete-container');
    const $deleteContent = $('div', 'chat__delete-content');
    const $deleteTitle = $('div', 'chat__delete-title');
    const $deleteQuestion = $('div', 'chat__delete-question');
    const $info = $('div', ['chat__delete-info', 'personal-message__info']);
    const $messageItem = $('p', ['chat__delete-message-item', 'personal-message__message']);

    $deleteTitle.textContent = __.settings.account.deleteAccount;
    $messageItem.textContent = __.settings.account.deleteQuestion;

    const $deleteButtons = $('div', 'chat__delete-buttons');
    const $cancelButton = $('button', 'chat__delete-btn-cancel');
    const $confirmButton = $('button', 'chat__delete-btn-delete');

    $cancelButton.textContent = capitalize(__.common.cancel);
    $confirmButton.textContent = capitalize(__.common.delete);

    $info.append($messageItem);
    $deleteContent.append($deleteTitle, $info);
    $deleteButtons.append($cancelButton, $confirmButton);
    $deleteContainer.append($deleteContent, $deleteButtons);

    $container.append($deleteContainer);

    $cancelButton.onclick = () => {
      this.cancelDeleteConfirmDialog();
    };

    $confirmButton.onclick = () => {
      this.onDeleteMessageDialogSubmit();
    };
  }

  showForm($form: HTMLFormElement): void {
    $form.style.display = 'flex';
    $form.classList.add('form_show');
  }

  hideForm($form: HTMLFormElement): void {
    $form.style.display = 'none';
    $form.classList.remove('form_show');
  }

  cancelDeleteConfirmDialog() {
    ModalView.hide();
  }

  bindShowFormButtonClick($button: HTMLButtonElement, $form: HTMLFormElement): void {
    $button.onclick = () => {
      this.showForm($form);
    };
  }

  bindHideFormButtonClick($button: HTMLButtonElement, $form: HTMLFormElement): void {
    $button.onclick = () => {
      this.hideForm($form);
    };
  }

  bindInputEscapeKey($input: HTMLInputElement, $form: HTMLFormElement): void {
    $input.onkeyup = (event) => {
      if (event.key && event.key.toLowerCase() === 'escape') {
        this.hideForm($form);
      }
    };
  }

  bindNameFormSubmit($form: HTMLFormElement): void {
    $form.onsubmit = async (event) => {
      event.preventDefault();
      const name = this.$nameInput.value.trim();
      await this.onNameFormSubmit(name);
      this.displayData({ name });
      this.hideForm($form);
    };
  }

  bindEmailFormSubmit($form: HTMLFormElement): void {
    $form.onsubmit = async (event) => {
      event.preventDefault();
      const email = this.$emailInput.value;
      await this.onEmailFormSubmit(email);
      this.displayData({ email });
      this.hideForm($form);
    };
  }

  bindEditUserProfileClick($button: HTMLButtonElement): void {
    $button.onclick = this.onEditUserProfileClick;
  }

  bindDeleteAccountClick($button: HTMLButtonElement): void {
    $button.onclick = this.onDeleteAccountClick;
  }

  onNameFormSubmit = async (name: string): Promise<void> => {};

  onEmailFormSubmit = async (email: string): Promise<void> => {};

  onEditUserProfileClick = (): void => {};

  onDeleteAccountClick = (): void => {};

  onDeleteMessageDialogSubmit = async (): Promise<void> => {};

  bindOnNameformSubmit = (handler: (name: string) => Promise<void>): void => {
    this.onNameFormSubmit = handler;
  };

  bindOnEmailformSubmit = (handler: (name: string) => Promise<void>): void => {
    this.onEmailFormSubmit = handler;
  };

  bindOnEditUserProfileClick = (handler: () => void): void => {
    this.onEditUserProfileClick = handler;
  };

  bindOnDeleteAccountClick = (handler: () => Promise<void>): void => {
    this.onDeleteAccountClick = handler;
  };

  bindOnDeleteMessageDialogSubmit = (handler: () => Promise<void>): void => {
    this.onDeleteMessageDialogSubmit = handler;
  };
}

export default SettingsAccountView;
