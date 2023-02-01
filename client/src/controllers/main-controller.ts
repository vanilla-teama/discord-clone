import Controller from '../lib/controller';

class MainController extends Controller {
  constructor() {
    super();
  }

  error(): void {
    console.error('error');
  }
}

export default MainController;
