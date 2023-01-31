import Controller from '../lib/controller';

class ServersController extends Controller {
  constructor() {
    super();
  }

  index(): void {
    console.log('index');
  }

  channels(): void {
    console.log('We are in channels');
  }

  error(): void {
    console.error('error');
  }
}

export default ServersController;
