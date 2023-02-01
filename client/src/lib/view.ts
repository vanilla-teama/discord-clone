abstract class View {
  private $root: HTMLElement | null = document.getElementById('root');

  protected $container = document.createDocumentFragment();

  render(): void {
    if (!this.$root) {
      throw new Error('Root element not found in index.html');
    }
    this.build();
    this.$root.innerHTML = '';
    this.$root.append(this.$container);
  }

  abstract build(): void;
}

export default View;
