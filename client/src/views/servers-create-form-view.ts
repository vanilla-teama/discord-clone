import View from '../lib/view';
import { Server } from '../types/entities';
import { $, capitalize, readImage } from '../utils/functions';
import ModalView from './modal-view';
import * as upload from '../assets/icons/upload.svg';
import * as plus from '../assets/icons/plus.svg';
import { translation } from '../utils/lang';

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
    const __ = translation();
    const $form = Object.assign($('form', ['form-create-server', 'form', 'form_white']), {
      enctype: 'multipart/form-data',
    });
    const $closeBtn = $('button', ['form-create-server__close-btn']);

    const $title = $('h3', ['form__title', 'form-create-server__title']);
    $title.textContent = __.serverForm.heading;

    const $subtitle = $('div', ['form__subtitle', 'form-create-server__subtitle']);
    $subtitle.textContent = __.serverForm.description;

    const $imageInputContainer = $('div', ['form__image-input-container', 'form-create-server__image-input-container']);
    const $imageInput = Object.assign($('input', 'form-create-server__input-image'), {
      name: 'image',
      type: 'file',
    });
    const $imageUpload = $('img', ['form-create-server__image-upload', 'form__image']);
    $imageUpload.src = upload.default;

    // $imageInput.onclick = (e: Event) => {
    //   const target = e.target as HTMLInputElement;
    //   if (target.value) {
    //     $imageUpload.src = plus.default;
    //   }
    // };

    const $inputContainer = $('div', ['form__input-container', 'form-create-server__input-container']);
    const $label = $('label', ['form__label', 'form-create-server__label']);
    $label.textContent = __.serverForm.serverName;
    const $nameInput = Object.assign($('input', ['form__input', 'form-create-server__name']), {
      name: 'name',
    });

    const $button = Object.assign($('button', ['form__btn-submit', 'form-create-server__submit']), {
      type: 'submit',
      textContent: capitalize(__.common.create),
    });

    $imageInputContainer.append($imageInput, $imageUpload);
    $inputContainer.append($label, $nameInput);
    $form.append($closeBtn, $title, $subtitle, $imageInputContainer, $inputContainer, $button);

    $closeBtn.onclick = (event) => {
      event.preventDefault();
      ModalView.hide();
    };

    this.bindImageChange($imageInput, $form, $imageUpload);

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

  bindImageChange($input: HTMLInputElement, $form: HTMLFormElement, $container: HTMLImageElement): void {
    $input.onchange = (event) => {
      event.preventDefault();
      const formData = new FormData($form);
      const image = formData.get('image');
      if (image instanceof File && image.size > 0) {
        readImage(image, $container, () => {
          $container.classList.add('selected');
        });
      } else {
        $container.classList.remove('selected');
        $container.src = upload.default;
      }
    };
  }
}

export default ServersCreateFormView;
