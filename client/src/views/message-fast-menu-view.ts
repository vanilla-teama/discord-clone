import View from '../lib/view';
import { $ } from '../utils/functions';
import { RenderedPersonalMessage } from './chats-main-content-view';

export type ReplyOrEdit = 'reply' | 'edit';

class MessageFastMenuView extends View {
  message: RenderedPersonalMessage;

  $message: HTMLLIElement;
  $editButton: HTMLButtonElement;
  $replyButton: HTMLButtonElement;
  $deleteButton: HTMLButtonElement;
  replyOrEdit: ReplyOrEdit;

  constructor($root: HTMLElement, $message: HTMLLIElement, message: RenderedPersonalMessage, replyOrEdit: ReplyOrEdit) {
    if (!$root) {
      MessageFastMenuView.throwNoRootInTheDomError(`MessageFastMenuView`);
    }
    super($root);
    this.message = message;
    this.$editButton = $('button', 'fast-menu__edit-btn');
    this.$replyButton = $('button', 'fast-menu__reply-btn');
    this.$deleteButton = $('button', 'fast-menu__delete-btn');
    this.$message = $message;
    this.replyOrEdit = replyOrEdit;
  }
  async build(): Promise<void> {
    const $container = document.createDocumentFragment();

    if (this.replyOrEdit === 'edit') {
      $container.append(this.$editButton, this.$deleteButton);
      this.$editButton.textContent = 'Edit';
      this.$deleteButton.textContent = 'Delete';
    } else {
      $container.append(this.$replyButton);
      this.$replyButton.textContent = 'Reply';
    }

    this.$container.append($container);
  }

  bindShowEditForm = (handler: ($message: HTMLLIElement) => void): void => {
    console.log('MessageFastMenuView.bindShowEditForm', this.$editButton, this.$message);
    this.$editButton.onclick = () => {
      handler(this.$message);
    };
  };

  bindDeleteMessage = (handler: ($message: HTMLLIElement) => void): void => {
    this.$deleteButton.onclick = () => {
      handler(this.$message);
    };
  };

  bindShowReply = (handler: () => void): void => {
    this.$editButton.onclick = handler;
  };
}

export default MessageFastMenuView;
