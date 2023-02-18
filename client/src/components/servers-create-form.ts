import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { Server } from '../types/entities';
import ServersCreateFormView from '../views/servers-create-form-view';

class ServerCreateFormComponent extends Controller<ServersCreateFormView> {
  constructor() {
    super(new ServersCreateFormView());
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindFormSubmit(this.handleAddServer);
  }

  handleAddServer = async (formData: FormData): Promise<void> => {
    await appStore.addServer(this.extractServer(formData));
  };

  private extractServer = (formData: FormData): Partial<Server<'formData'>> => {
    const server: Partial<Server<'formData'>> = {};
    const name = formData.get('name');
    const image = formData.get('image');

    if (typeof name === 'string' && image instanceof File) {
      server.name = name.trim();
      server.image = image;
      server.owner = appStore.user?.id;
    }

    return server;
  };
}

export default ServerCreateFormComponent;
