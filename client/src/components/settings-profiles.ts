import Controller from '../lib/controller';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Profile } from '../types/entities';
import ModalView from '../views/modal-view';
import SettingsProfilesView, { ProfileChanges } from '../views/settings-profiles-view';
import ModalComponent from './modal';

class SettingsProfilesComponent extends Controller<SettingsProfilesView> {
  profile: Profile;
  constructor() {
    if (!appStore.user) {
      throw Error('User not found');
    }
    super(new SettingsProfilesView());
    this.profile = appStore.user.profile || {
      about: null,
      avatar: null,
      banner: null,
    };
  }

  async init(): Promise<void> {
    this.view.bindOnChangeAvatarButtonClick(this.showAvatarForm);
    this.view.bindSaveChanges(this.saveProfile);
    this.view.render();
    this.displayProfileData();
  }

  displayProfileData(): void {
    if (!appStore.user) {
      return;
    }
    this.view.displayProfileData(this.profile, appStore.user.name);
  }

  showAvatarForm = async (): Promise<void> => {
    await new ModalComponent().init();
    this.view.displayAvatarForm(ModalView.getContainer());
    ModalView.show();
  };

  saveProfile = async (profile: ProfileChanges): Promise<void> => {
    await appStore.updateProfile(profile);
    if (appStore.user) {
      this.profile = appStore.user.profile;
      this.displayProfileData();
      socket.emit('accountUpdated', { userId: appStore.user.id });
    }
  };
}

export default SettingsProfilesComponent;
