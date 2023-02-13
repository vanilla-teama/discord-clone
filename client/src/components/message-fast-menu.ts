import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { PersonalMessage } from '../types/entities';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';
import MessageFastMenuView, { ReplyOrEdit } from '../views/message-fast-menu-view';

class MessageFastMenu extends Controller<MessageFastMenuView> {
  constructor($container: HTMLElement, $message: HTMLLIElement, message: RenderedPersonalMessage) {
    const getReplyOrEdit = (message: RenderedPersonalMessage): ReplyOrEdit => {
      if (!appStore.user) {
        return 'edit';
      }
      if (message.userId === appStore.user.id) {
        return 'edit';
      } else {
        return 'reply';
      }
    };
    super(new MessageFastMenuView($container, $message, message, getReplyOrEdit(message)));
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindShowEditForm(MessageFastMenu.showEditForm);
  }

  destroy(): void {
    this.view.getRootElement().innerHTML = '';
  }

  static showEditForm = ($message: HTMLLIElement): void => {};

  static bindShowEditForm = (handler: ($message: HTMLLIElement) => void): void => {
    MessageFastMenu.showEditForm = handler;
  };
}

export default MessageFastMenu;
