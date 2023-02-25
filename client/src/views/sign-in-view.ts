import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import { translation } from '../utils/lang';

class SignInView extends View {
  static readonly classNames = {};

  $signUpButton: HTMLButtonElement;
  $form: HTMLFormElement;
  $errorContainer: HTMLDivElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignInView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-in__form');
    this.$signUpButton = $('button', 'btn btn-auth');
    this.$errorContainer = $('div', 'sign-in__error-container');
  }

  build(): void {
    const __ = translation();
    const $container = $('div', 'sign-in');
    const $box = $('div', 'sign-in__box');
    const $title = $('div', 'sign-in__title');
    $title.textContent = __.auth.welcome;

    this.$form.innerHTML = `
      <div class="sign-in__form-wrapper">
        <label class="sign-in__form-label" for="email">${__.auth.email}:</label>
        <input class="sign-in__input-email" type="email" name="email">
      </div>
      <div class="sign-in__form-wrapper">
        <label class="sign-in__form-label" for="password">${__.auth.password}:</label>
        <input class="sign-in__input-password" type="password" id="password" name="password">
      </div>
      <button class="sign-in__btn-submit  type="submit">${__.auth.logIn}</button>
    `;

    const $btnSignUpBox = $('span', 'sign-in__btn-auth-box');
    const $text = $('span', 'sign-in__text');
    $text.textContent = __.auth.needAccount;
    this.$signUpButton.textContent = __.auth.register;
    $btnSignUpBox.append($text, this.$signUpButton);

    $box.append($title, this.$errorContainer, this.$form, $btnSignUpBox);
    $container.append($box);
    this.$container.append($container);
  }

  bindControllerState(handler: Dispatch<StartScreenComponentState>) {
    this.$signUpButton?.addEventListener('click', () => handler({ render: 'signup' }));
  }

  bindSignIn(handler: (data: FormData) => void) {
    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler(new FormData(this.$form));
    });
  }

  displayError(message: string) {
    this.$errorContainer.innerHTML = '';
    this.$errorContainer.textContent = message;
  }
}

export default SignInView;
