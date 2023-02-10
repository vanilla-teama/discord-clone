import App from './app';
import View from './view';

type ComponentsMap<V extends View = View, C extends Controller<V> = Controller<V>> = Map<
  new (...args: unknown[]) => C,
  C
>;

interface IController<T extends View = View> {
  readonly view: T;
  init: () => Promise<void>;
}

class Controller<V extends View> implements IController<V> {
  protected params: string[];

  readonly view: V;

  private static _componentsMap: ComponentsMap = new Map();

  static get componentsMap(): ComponentsMap {
    return Controller._componentsMap;
  }

  getParams(): string[] {
    return this.params;
  }

  async init() {}

  constructor(view: V) {
    this.params = App.getRouter().getParams();
    this.view = view;
    // Controller.componentsMap.set(Object.getPrototypeOf(this).constructor, this);
  }
}

export default Controller;
