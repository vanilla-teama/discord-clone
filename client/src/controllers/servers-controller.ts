import Controller from '../lib/controller';

class ServersController extends Controller {
  constructor() {
    super();
  }

  async index(): Promise<void> {
    console.log('index');
  }

  async channels(): Promise<void> {
    console.log('We are in channels');
  }

  async error(): Promise<void> {
    console.error('error');
  }
}

export default ServersController;
