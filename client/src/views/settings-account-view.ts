import View from '../lib/view';
import { $, isClosestElementOfCssClass } from '../utils/functions';
import MainView from './main-view';
import ModalView from './modal-view';
import SettingsContentView from './settings-content-view';
import { defaultBanner } from './settings-profiles-view';
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
    nameForm: 'form-account-name',
    nameFormSubmit: 'form-account-name__submit',
    nameFormCancel: 'form-account-name__cancel',
    emailForm: 'form-account-email',
    emailFormSubmit: 'form-account-email__submit',
    emailFormCancel: 'form-account-email__cancel',
    nameInput: 'form-account-name__input',
    emailInput: 'form-account-email__input',
  };

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
    this.$bannerBlock = $('div', SettingsAccountView.classNames.infoBlockHeader);
    this.$headingNickname = $('div', SettingsAccountView.classNames.nickName);
    this.$name = $('div', SettingsAccountView.classNames.titleBody);
    this.$email = $('div', SettingsAccountView.classNames.titleBody);
    this.$nameInput = $('input', SettingsAccountView.classNames.nameInput);
    this.$emailInput = $('input', SettingsAccountView.classNames.emailInput);
  }
  build(): void {
    const $mainBlock = $('div', SettingsAccountView.classNames.mainBlock);
    const $titleMain = Object.assign($('div', SettingsAccountView.classNames.titleMain), {
      textContent: 'My Account',
    });
    const $blocDelete = $('div');
    const $titlDelete = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'Delete Account',
    });
    const $buttonDelete = Object.assign($('button', SettingsAccountView.classNames.buttonDelete), {
      textContent: 'Delete Account',
    });
    $blocDelete.append($titlDelete, $buttonDelete);
    const $infoBlock = $('div', SettingsAccountView.classNames.infoBlock);
    const $infoBlockHeader = this.$bannerBlock;
    const $avatarBlockHeader = $('div', SettingsAccountView.classNames.avatarBlockHeader);
    $infoBlockHeader.append($avatarBlockHeader);
    const $blockBody = $('div', SettingsAccountView.classNames.blockBody);
    const $nickName = this.$headingNickname;
    const $buttonUserProf = Object.assign($('button', SettingsAccountView.classNames.buttonUserProf), {
      textContent: 'Edit User Profile',
    });
    const $nickNameContainer = $('div', SettingsAccountView.classNames.nickNameContainer);
    $nickNameContainer.append($nickName, $buttonUserProf);
    const $blockName = $('div');
    const $blockSettingName = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleBodyName = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'Username',
    });
    const $titleName = this.$name;
    $blockName.append($titleBodyName, $titleName);
    const $buttonName = $('button', SettingsAccountView.classNames.bodyButton);
    $buttonName.textContent = 'Edit';
    $blockSettingName.append($blockName, $buttonName);
    const $blockMail = $('div');
    const $blockSettingMail = $('div', SettingsAccountView.classNames.blockSettingProfile);
    const $titleSettingsMail = Object.assign($('div', SettingsAccountView.classNames.titleSettingsBody), {
      textContent: 'Email',
    });
    const $titleDesc = this.$email;
    const $buttonEmail = $('button', SettingsAccountView.classNames.bodyButton);
    $buttonEmail.textContent = 'Edit';
    $blockMail.append($titleSettingsMail, $titleDesc);
    $blockSettingMail.append($blockMail, $buttonEmail);
    $blockBody.append($blockSettingName, $blockSettingMail);
    $infoBlock.append($infoBlockHeader, $nickNameContainer, $blockBody);

    const $nameForm = $('form', SettingsAccountView.classNames.nameForm);
    const $nameInput = this.$nameInput;
    const $nameFormSubmitButton = $('button', SettingsAccountView.classNames.nameFormSubmit);
    const $nameFormCancelButton = $('button', SettingsAccountView.classNames.nameFormCancel);
    $nameForm.append($nameInput, $nameFormSubmitButton, $nameFormCancelButton);
    $nameForm.style.display = 'none';
    $nameFormSubmitButton.type = 'submit';
    $nameFormSubmitButton.textContent = 'Save';
    $nameFormCancelButton.textContent = 'Cancel';

    const $emailForm = $('form', SettingsAccountView.classNames.emailForm);
    const $emailInput = this.$emailInput;
    const $emailFormSubmitButton = $('button', SettingsAccountView.classNames.emailFormSubmit);
    const $emailFormCancelButton = $('button', SettingsAccountView.classNames.emailFormCancel);
    $emailInput.type = 'email';
    $emailForm.append($emailInput, $emailFormSubmitButton, $emailFormCancelButton);
    $emailForm.style.display = 'none';
    $emailFormSubmitButton.type = 'submit';
    $emailFormSubmitButton.textContent = 'Save';
    $emailFormCancelButton.textContent = 'Cancel';

    $blockName.append($nameForm);
    $blockMail.append($emailForm);

    $mainBlock.append($titleMain, $infoBlock, $blocDelete);

    this.bindShowFormButtonClick($buttonName, $nameForm);
    this.bindShowFormButtonClick($buttonEmail, $emailForm);
    this.bindHideFormButtonClick($nameFormCancelButton, $nameForm);
    this.bindHideFormButtonClick($emailFormCancelButton, $emailForm);

    this.bindNameFormSubmit($nameForm);
    this.bindEmailFormSubmit($emailForm);

    this.bindEditUserProfileClick($buttonUserProf);
    this.bindDeleteAccountClick($buttonDelete);

    this.$container.append($mainBlock);
  }

  displayData({ name, email, banner }: { name?: string; email?: string; banner?: string | null }): void {
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
  }

  displayDeleteConfirmDialog($container: HTMLElement): void {
    const $deleteContainer = $('div', 'chat__delete-container');
    const $deleteContent = $('div', 'chat__delete-content');
    const $deleteTitle = $('div', 'chat__delete-title');
    const $deleteQuestion = $('div', 'chat__delete-question');
    const $info = $('div', ['chat__delete-info', 'personal-message__info']);
    const $messageItem = $('p', ['chat__delete-message-item', 'personal-message__message']);

    $deleteTitle.textContent = `Delete Account.`;
    // $deleteQuestion.textContent = `Are you sure you want to delete your Account?`;
    $messageItem.textContent = `Are you sure you want to delete your Account?`;

    const $deleteButtons = $('div', 'chat__delete-buttons');
    const $cancelButton = $('button', 'chat__delete-btn-cancel');
    const $confirmButton = $('button', 'chat__delete-btn-delete');

    $cancelButton.textContent = 'Cancel';
    $confirmButton.textContent = 'Delete';

    $info.append($messageItem);
    $deleteContent.append($deleteTitle, $info);
    $deleteButtons.append($cancelButton, $confirmButton);
    $deleteContainer.append($deleteContent, $deleteButtons);

    $container.append($deleteContainer);

    $cancelButton.onclick = () => {
      this.cancelDeleteConfirmDialog();
    };

    $confirmButton.onclick = () => {
      console.log('click');
      this.onDeleteMessageDialogSubmit();
    };
  }

  showForm($form: HTMLFormElement): void {
    $form.style.display = 'block';
  }

  hideForm($form: HTMLFormElement): void {
    $form.style.display = 'none';
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
