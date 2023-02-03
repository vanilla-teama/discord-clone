import App from './app';
import View from './view';

interface IController<T extends View = View> {
  readonly view: T;
  init: () => Promise<void>;
}

class Controller<V extends View> implements IController<V> {
  protected params: string[];

  readonly view: V;

  getParams(): string[] {
    return this.params;
  }

  async init() {}

  constructor(view: V) {
    this.params = App.getRouter().getParams();
    this.view = view;
  }
}

export default Controller;
