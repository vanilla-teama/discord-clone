import App from './app';

class Controller {
  protected params: string[];

  getParams(): string[] {
    return this.params;
  }

  constructor() {
    this.params = App.getRouter().getParams();
  }

  error(): void {
    console.error('error');
  }
}

export default Controller;
