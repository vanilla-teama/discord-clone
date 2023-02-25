import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';

class SignUpView extends View {
  static readonly classNames = {};

  $signInButton: HTMLButtonElement;
  $form: HTMLFormElement;
  $errorContainer: HTMLDivElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignUpView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-up__form');
    this.$signInButton = $('button', 'btn btn-auth');
    this.$errorContainer = $('div', 'sign-up__error-container');
  }
  build(): void {
    const __ = translation();
    const $container = $('div', 'sign-up');

    const $box = $('div', 'sign-up__box');
    const $title = $('div', 'sign-up__title');
    $title.textContent = __.auth.createAccount;

    this.$form.innerHTML = `
    <div class="sign-up__form-wrapper">
      <label class="sign-up__form-label" for="email">${__.auth.email}:</label>
      <input class="sign-up__input-email" type="email" name="email">
    </div>
    <div class="sign-up__form-wrapper">
      <label class="sign-up__form-label" for="name">${__.auth.username}:</label>
      <input class="sign-up__input-name" type="text" name="name">
    </div>
    <div class="sign-up__form-wrapper">
      <label class="sign-up__form-label" for="password">${__.auth.password}:</label>
      <input class="sign-up__input-password" type="password" id="password" name="password">
    </div>
    <button class="sign-up__btn-submit type="submit">${__.auth.register}</button>
  `;

    this.$signInButton.textContent = __.auth.alreadyHaveAccount;

    $box.append($title, this.$errorContainer, this.$form, this.$signInButton);
    $container.append($box);

    this.$container.append($container);
  }

  bindControllerState(handler: Dispatch<StartScreenComponentState>) {
    if (this.$signInButton) {
      this.$signInButton.addEventListener('click', () => handler({ render: 'signin' }));
    }
  }

  bindSignUp(handler: (data: FormData) => void) {
    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler(new FormData(this.$form));
    });
  }

  displayError(errors: string[]) {
    this.$errorContainer.innerHTML = '';
    this.$errorContainer.innerHTML = errors.join('<br/>');
  }
}

export default SignUpView;
