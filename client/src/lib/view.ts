abstract class View<T extends HTMLElement = HTMLElement> {
  protected $root: T;

  protected $container = document.createDocumentFragment();

  constructor($root: T) {
    this.$root = $root;
  }

  getRootElement(): T {
    return this.$root;
  }

  async render(): Promise<void> {
    this.build();
    this.$root.innerHTML = '';
    this.$root.append(this.$container);
    this.onAfterRender();
  }

  private onAfterRender = (): void => {};

  bindAfterRender(handler: () => void) {
    this.onAfterRender = handler;
  }

  abstract build(): void;

  protected static throwNoRootInTheDomError(name: string): never {
    throw new Error(`${name} element must be rendered before instantiating this view`);
  }
}

export default View;
