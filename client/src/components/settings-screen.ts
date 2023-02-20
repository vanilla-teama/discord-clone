import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import SettingsScreenView from '../views/settings-screen-view';
import ModalPortalComponent from './modal-portal';
import SettingsContentComponent from './settings-content';
import SettingsSidebarComponent from './settings-sidebar';

class SettingsScreen extends Controller<SettingsScreenView> {
  constructor() {
    super(new SettingsScreenView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.onRouteChanged();
    this.bindRouteChanged();
    await new ModalPortalComponent(SettingsScreenView.$portal).init();
  }

  onClose: EventListener = () => {
    Router.push(RouteControllers.Chats);
  };

  bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, this.routeChangeHandler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, this.routeChangeHandler);
    window.removeEventListener('popstate', this.routeChangeHandler);
    window.addEventListener('popstate', this.routeChangeHandler);
  }

  private routeChangeHandler: EventListener = async (event) => {
    if (event instanceof PopStateEvent) {
      if (App.getRouter().getController() === RouteControllers.Settings) {
        this.onRouteChanged();
      }
    } else {
      const {
        detail: { controller },
      } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);
      if (controller === RouteControllers.Settings) {
        this.onRouteChanged();
      }
    }
  };

  onRouteChanged = async (): Promise<void> => {
    await new SettingsSidebarComponent().init();
    await new SettingsContentComponent().init();
    this.view.bindClose(this.onClose);
  };
}

export default SettingsScreen;
