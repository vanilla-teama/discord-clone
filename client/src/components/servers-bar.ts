import { servers as fakeServers } from '../develop/data';
import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Server } from '../types/entities';
import { CustomEvents } from '../types/types';
import { getTypedCustomEvent } from '../utils/functions';
import ServersBarView from '../views/servers-bar-view';
import ModalComponent from './modal';
import ServerCreateFormComponent from './servers-create-form';

class ServersBarComponent extends Controller<ServersBarView> {
  constructor() {
    super(new ServersBarView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindShowServerForm(this.showServerForm);
    this.view.bindOnServerItemClick(this.onServerItemClick);
    // Do not delete this comment!
    // this.onServerListChanged(appStore.servers);

    this.onServerListChanged(fakeServers);
    appStore.bindServerListChanged(this.onServerListChanged);
    this.bindRouteChanged();
  }

  onServerListChanged = (servers: Server[]) => {
    this.view.displayServers(servers);
    this.toggleActiveStatus();
  };

  showServerForm(mode: 'create' | 'edit'): EventListener {
    return async () => {
      if (mode === 'create') {
        await new ModalComponent().init();
        await new ServerCreateFormComponent().init();
      }
    };
  }

  toggleActiveStatus() {
    const params = App.getRouter().getParams();
    this.view.toggleActiveStatus(params[0]);
  }

  bindRouteChanged() {
    document.addEventListener(CustomEvents.AFTERROUTERPUSH, (event) => {
      const {
        detail: { controller, params },
      } = getTypedCustomEvent(CustomEvents.AFTERROUTERPUSH, event);

      if (controller === RouteControllers.Servers && params.length > 0) {
        this.view.toggleActiveStatus(params[0]);
      }
    });
  }

  onServerItemClick = (serverId: string): void => {
    Router.push(RouteControllers.Servers, '', [serverId]);
  };
}

export default ServersBarComponent;
