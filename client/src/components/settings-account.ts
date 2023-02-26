import Controller from '../lib/controller';
import Router, { RouteControllers, SettingsParams } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import ModalView from '../views/modal-view';
import SettingsAccountView from '../views/settings-account-view';
import ModalComponent from './modal';
import SettingsSidebarComponent from './settings-sidebar';

class SettingsAccountComponent extends Controller<SettingsAccountView> {
  constructor() {
    super(new SettingsAccountView());
  }

  async init(): Promise<void> {
    this.view.bindOnNameformSubmit(this.updateName);
    this.view.bindOnEmailformSubmit(this.updateEmail);
    this.view.bindOnEditUserProfileClick(this.redirectToProfile);
    this.view.bindOnDeleteAccountClick(this.showConfirmDeleteDialog);
    this.view.bindOnDeleteMessageDialogSubmit(this.deleteAccount);
    this.view.render();
    this.displayData();
  }

  displayData(): void {
    if (!appStore.user) {
      return;
    }
    this.view.displayData({
      name: appStore.user.name,
      email: appStore.user.email,
      banner: appStore.user.profile?.banner || null,
      avatar: appStore.user.profile?.avatar || null,
    });
  }

  updateName = async (name: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await appStore.updateUser(appStore.user.id, { name });
    socket.emit('accountUpdated', { userId: appStore.user.id });
  };

  updateEmail = async (email: string): Promise<void> => {
    if (!appStore.user) {
      return;
    }
    await appStore.updateUser(appStore.user.id, { email });
    socket.emit('accountUpdated', { userId: appStore.user.id });
  };

  deleteAccount = async (): Promise<void> => {
    await appStore.deleteCurrentUser();
    SettingsSidebarComponent.clearComponentsData();
    Router.push(RouteControllers.Start);
  };

  redirectToProfile = () => {
    Router.push(RouteControllers.Settings, '', [SettingsParams.Profiles]);
  };

  showConfirmDeleteDialog = async (): Promise<void> => {
    await new ModalComponent().init();
    this.view.displayDeleteConfirmDialog(ModalView.getContainer());
    ModalView.show();
  };
}

export default SettingsAccountComponent;
