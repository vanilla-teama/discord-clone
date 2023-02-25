import View from '../lib/view';
import { $, capitalize } from '../utils/functions';
import { translation } from '../utils/lang';
import ModalView from './modal-view';

class ChannelsCreateFormView extends View {
  static readonly classNames = {};

  $form: HTMLFormElement;

  constructor() {
    const $root = ModalView.getContainer();
    if (!$root) {
      ChannelsCreateFormView.throwNoRootInTheDomError('Channels-Create-Form');
    }
    super($root);
    this.$form = this.createForm();
  }
  build(): void {
    this.bindAfterRender(this.afterRender);
    this.$container.append(this.$form);
  }

  afterRender = (): void => {
    ModalView.show();
  };

  private createForm(): HTMLFormElement {
    const __ = translation();
    const $form = Object.assign($('form', ['form-create-server', 'form', 'form_white']), {
      enctype: 'multipart/form-data',
    });
    const $closeBtn = $('button', ['form-create-server__close-btn']);

    const $title = $('h3', ['form__title', 'form-create-server__title']);
    $title.textContent = __.sidebar.createChannel;

    const $inputContainer = $('div', ['form__input-container', 'form-create-server__input-container']);
    const $label = $('label', ['form__label', 'form-create-server__label']);
    $label.textContent = __.sidebar.channelName;
    const $nameInput = Object.assign($('input', ['form__input', 'form-create-server__name']), {
      name: 'name',
    });

    const $button = Object.assign($('button', ['form__btn-submit', 'form-create-server__submit']), {
      type: 'submit',
      textContent: capitalize(__.common.create),
    });

    $inputContainer.append($label, $nameInput);
    $form.append($closeBtn, $title, $inputContainer, $button);

    return $form;
  }

  bindFormSubmit(handler: (data: FormData) => Promise<void>) {
    this.$form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(this.$form);
      await handler(formData);
      ModalView.hide();
    });
  }
}

export default ChannelsCreateFormView;
