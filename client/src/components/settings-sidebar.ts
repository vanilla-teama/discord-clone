import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent, isKeyOf } from '../utils/functions';
import SettingsSidebarView from '../views/settings-sidebar-view';

class SettingsSidebarComponent extends Controller<SettingsSidebarView> {
  constructor() {
    super(new SettingsSidebarView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.toggleActiveStatus(App.getRouter().getParams()[0]);
    this.bindRouteChanged();
  }

  bindRouteChanged() {
    document.removeEventListener(CustomEvents.AFTERROUTERPUSH, this.routeChangeHandler);
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, this.routeChangeHandler);
  }

  private routeChangeHandler = (event: Event): void => {
    const {
      detail: { controller, action, params },
    } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

    this.onRouteChanged(controller, action, params);
  };

  private onRouteChanged(controller: string, action: string, params: string[]): void {
    if (controller !== RouteControllers.Settings && action !== '') {
      Router.push('');
    }
    this.view.toggleActiveStatus(params[0]);
  }
}

export default SettingsSidebarComponent;
