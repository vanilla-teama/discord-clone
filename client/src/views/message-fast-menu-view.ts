import View from '../lib/view';
import { appStore } from '../store/app-store';
import { $, capitalize } from '../utils/functions';
import { translation } from '../utils/lang';
import { RenderedPersonalMessage } from './chats-main-content-view';
import { RenderedChannelMessage } from './servers-main-content-view';

export type ReplyOrEdit = 'reply' | 'edit' | null;

class MessageFastMenuView extends View {
  message: RenderedPersonalMessage | RenderedChannelMessage;

  $message: HTMLLIElement;
  $editButton: HTMLButtonElement;
  $replyButton: HTMLButtonElement;
  $deleteButton: HTMLButtonElement;
  replyOrEdit: ReplyOrEdit;

  constructor(
    $root: HTMLElement,
    $message: HTMLLIElement,
    message: RenderedPersonalMessage | RenderedChannelMessage,
    replyOrEdit: ReplyOrEdit
  ) {
    if (!$root) {
      MessageFastMenuView.throwNoRootInTheDomError(`MessageFastMenuView`);
    }
    super($root);
    this.message = message;
    this.$editButton = $('button', ['tooltip', 'fast-menu__edit-btn']);
    this.$replyButton = $('button', ['tooltip', 'fast-menu__reply-btn']);
    this.$deleteButton = $('button', ['tooltip', 'fast-menu__delete-btn']);
    this.$message = $message;
    this.replyOrEdit = replyOrEdit;
  }
  async build(): Promise<void> {
    const __ = translation();
    const $container = document.createDocumentFragment();

    // if (this.replyOrEdit === 'edit') {
    //   $container.append(this.$editButton, this.$deleteButton);
    //   this.$editButton.dataset.text = 'Edit';
    //   this.$deleteButton.dataset.text = 'Delete';
    // } else if (this.replyOrEdit === 'reply') {
    //   this.$replyButton.dataset.text = 'Reply';
    //   $container.append(this.$replyButton);
    // }
    if (!('service' in this.message) || !this.message.service) {
      $container.append(this.$replyButton);
      this.$replyButton.dataset.text = capitalize(__.common.reply);

      if (this.message.userId === appStore.user?.id) {
        $container.append(this.$editButton, this.$deleteButton);
        this.$editButton.dataset.text = capitalize(__.common.edit);
        this.$deleteButton.dataset.text = capitalize(__.common.delete);
      }
    }

    this.$container.append($container);
  }

  bindShowEditForm = (handler: ($message: HTMLLIElement) => void): void => {
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
