import View from '../lib/view';
import { Server } from '../types/entities';
import { $ } from '../utils/functions';
import ModalView from './modal-view';

class ServersCreateFormView extends View {
  static readonly classNames = {};

  $form: HTMLFormElement;

  constructor() {
    const $root = ModalView.getContainer();
    if (!$root) {
      ServersCreateFormView.throwNoRootInTheDomError('Servers-Create-Form');
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
    const $form = Object.assign($('form', 'form-create-server'), {
      enctype: 'multipart/form-data',
    });
    const $header = $('h3');
    const $nameInput = Object.assign($('input', 'form-create-server__name'), {
      name: 'name',
    });
    const $imageInput = Object.assign($('input', 'form-create-server__name'), {
      name: 'image',
      type: 'file',
    });
    const $button = Object.assign($('button', 'form-create-server__submit'), {
      type: 'submit',
      textContent: 'Create',
    });
    $header.textContent = 'Create Server';
    $form.append($header, $nameInput, $imageInput, $button);

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

export default ServersCreateFormView;
