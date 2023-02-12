import View from '../lib/view';

class MessageFastMenuView extends View {
  constructor($root: HTMLElement) {
    if (!$root) {
      MessageFastMenuView.throwNoRootInTheDomError(`MessageFastMenuView`);
    }
    super($root);
  }
  async build(): Promise<void> {
    this.$container.append('I am fast menu');
  }
}

export default MessageFastMenuView;
