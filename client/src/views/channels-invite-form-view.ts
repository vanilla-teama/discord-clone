import View from '../lib/view';
import { $ } from '../utils/functions';
import ModalView from './modal-view';

class ChannelsInviteFormView extends View {
  static readonly classNames = {};

  $form: HTMLFormElement;
  $title: HTMLHeadingElement;
  $subtitle: HTMLHeadingElement;

  constructor() {
    const $root = ModalView.getContainer();
    if (!$root) {
      ChannelsInviteFormView.throwNoRootInTheDomError('Channels-Invote-Form');
    }
    super($root);
    this.$title = $('h3', ['form__title', 'form-create-server__title']);
    this.$subtitle = $('h4', ['form__title', 'form-create-server__subtitle']);
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
    const $form = Object.assign($('form', ['form-create-server', 'form', 'form_white']), {
      enctype: 'multipart/form-data',
    });
    const $closeBtn = $('button', ['form-create-server__close-btn']);

    this.$title.textContent = 'No Server';
    this.$subtitle.textContent = 'No Channel';

    $form.append($closeBtn, this.$title, this.$subtitle);

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

  displayTitle(serverName: string, channelName: string) {
    this.$title.textContent = `Invite friends to ${serverName}`;
    this.$subtitle.textContent = `#${channelName}`;
  }
}

export default ChannelsInviteFormView;
