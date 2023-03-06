import Controller from '../lib/controller';
import { appStore } from '../store/app-store';
import { PersonalMessage } from '../types/entities';
import { isElementOfCssClass } from '../utils/functions';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';
import MessageFastMenuView, { ReplyOrEdit } from '../views/message-fast-menu-view';
import { RenderedChannelMessage } from '../views/servers-main-content-view';

class MessageFastMenu extends Controller<MessageFastMenuView> {
  private static _instance: MessageFastMenu;

  static get instance(): MessageFastMenu {
    return MessageFastMenu._instance;
  }

  constructor($container: HTMLElement, $message: HTMLLIElement, message: RenderedPersonalMessage) {
    if (MessageFastMenu.instance) {
      MessageFastMenu.instance.destroy();
    }
    const getReplyOrEdit = (message: RenderedPersonalMessage | RenderedChannelMessage): ReplyOrEdit => {
      if (!appStore.user) {
        return 'edit';
      }
      if ('service' in message && message.service) {
        return null;
      }
      if (message.userId === appStore.user.id) {
        return 'edit';
      } else {
        return 'reply';
      }
    };
    super(new MessageFastMenuView($container, $message, message, getReplyOrEdit(message)));
    MessageFastMenu._instance = this;
  }

  async init(): Promise<void> {
    await this.view.render();
  }

  destroy(): void {
    this.view.getRootElement().innerHTML = '';
  }

  static onEditButtonClick = (event: MouseEvent): void => {
    if (isElementOfCssClass(event.target, 'fast-menu__edit-btn')) {
      MessageFastMenu.displayEditMessageForm(event);
    }
  };

  static onDeleteButtonClick = async (event: MouseEvent): Promise<void> => {
    if (isElementOfCssClass(event.target, 'fast-menu__delete-btn')) {
      await MessageFastMenu.displayDeleteConfirmModal(event);
    }
  };

  static onReplyButtonClick = (event: MouseEvent): void => {
    if (isElementOfCssClass(event.target, 'fast-menu__reply-btn')) {
      MessageFastMenu.displayReply(event);
    }
  };

  static displayEditMessageForm = (event: MouseEvent): void => {};

  static displayDeleteConfirmModal = async (event: MouseEvent): Promise<void> => {};

  static displayReply = (event: MouseEvent): void => {};

  static bindDisplayEditMessageForm = (handler: (event: MouseEvent) => void): void => {
    MessageFastMenu.displayEditMessageForm = handler;
  };

  static bindDisplayDeleteConfirmModal = (handler: (event: MouseEvent) => Promise<void>): void => {
    MessageFastMenu.displayDeleteConfirmModal = handler;
  };

  static bindDisplayReply = (handler: (event: MouseEvent) => void): void => {
    MessageFastMenu.displayReply = handler;
  };
}

export default MessageFastMenu;
