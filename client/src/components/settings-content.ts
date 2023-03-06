import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers, SettingsParams } from '../lib/router';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent, isKeyOf } from '../utils/functions';
import SettingsContentView from '../views/settings-content-view';
import SettingsAccountComponent from './settings-account';
import SettingsAppearanceComponent from './settings-appearance';
import SettingsKeybindingsComponent from './settings-keybindings';
import SettingsLanguageComponent from './settings-language';
import SettingsProfilesComponent from './settings-profiles';

const routes = {
  [SettingsParams.Account]: SettingsAccountComponent,
  [SettingsParams.Profiles]: SettingsProfilesComponent,
  [SettingsParams.Appearance]: SettingsAppearanceComponent,
  [SettingsParams.Keybinds]: SettingsKeybindingsComponent,
  [SettingsParams.Language]: SettingsLanguageComponent,
};

class SettingsContentComponent extends Controller<SettingsContentView> {
  constructor() {
    super(new SettingsContentView());
  }

  async init(): Promise<void> {
    const router = App.getRouter();
    const controller = router.getController();
    const action = router.getAction();
    const params = router.getParams();

    SettingsContentComponent.onRouteChanged(controller, action, params);
  }

  private static onRouteChanged(controller: string, action: string, params: string[]): void {
    if (controller !== RouteControllers.Settings && action !== '') {
      Router.push('');
    }

    if (isKeyOf(params[0], routes)) {
      new routes[params[0]]().init();
    }
  }
}

export default SettingsContentComponent;
