import View from '../lib/view';
import { $ } from '../utils/functions';
import { RenderedPersonalMessage } from './chats-main-content-view';

export type ReplyOrEdit = 'reply' | 'edit';

class MessageFastMenuView extends View {
  message: RenderedPersonalMessage;

  $message: HTMLLIElement;
  $editButton: HTMLButtonElement;
  $replyButton: HTMLButtonElement;
  replyOrEdit: ReplyOrEdit;

  constructor($root: HTMLElement, $message: HTMLLIElement, message: RenderedPersonalMessage, replyOrEdit: ReplyOrEdit) {
    if (!$root) {
      MessageFastMenuView.throwNoRootInTheDomError(`MessageFastMenuView`);
    }
    super($root);
    this.message = message;
    this.$editButton = $('button', 'fast-menu__edit-btn');
    this.$replyButton = $('button', 'fast-menu__reply-btn');
    this.$message = $message;
    this.replyOrEdit = replyOrEdit;
  }
  async build(): Promise<void> {
    const $container = document.createDocumentFragment();
    let $replyOrEditButton: HTMLButtonElement;

    if (this.replyOrEdit === 'edit') {
      $replyOrEditButton = this.$editButton;
      this.$editButton.textContent = 'Edit';
    } else {
      $replyOrEditButton = this.$replyButton;
      this.$replyButton.textContent = 'Reply';
    }
    $container.append($replyOrEditButton);

    this.$container.append($container);
  }

  bindShowEditForm = (handler: ($message: HTMLLIElement) => void): void => {
    this.$editButton.onclick = () => {
      handler(this.$message);
    };
  };

  bindShowReply = (handler: () => void): void => {
    this.$editButton.onclick = handler;
  };
}

export default MessageFastMenuView;
