import Controller from '../lib/controller';
import MessageFastMenuView from '../views/message-fast-menu-view';

class MessageFastMenu extends Controller<MessageFastMenuView> {
  constructor($root: HTMLElement) {
    super(new MessageFastMenuView($root));
  }

  async init(): Promise<void> {
    this.view.render();
  }

  destroy(): void {
    this.view.getRootElement().innerHTML = '';
  }
}

export default MessageFastMenu;
