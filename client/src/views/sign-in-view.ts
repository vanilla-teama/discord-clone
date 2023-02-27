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
  $footer: HTMLElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignInView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-in__form');
    this.$signUpButton = $('button', 'btn btn-auth');
    this.$errorContainer = $('div', 'sign-in__error-container');
    this.$footer = this.createFooter();
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
    this.$container.append($container, this.$footer);
  }

  private createFooter(): HTMLElement {
    const $footer = $('footer', 'footer');
    const $footerContainer = $('div', 'footer__container');
    const $develops = $('div', 'footer__develops');

    const $develop1 = $('a', 'footer__develop-1');
    $develop1.textContent = 'superconscience';
    $develop1.href = 'https://github.com/superconscience';
    $develop1.target = '_blank';
    const $develop2 = $('a', 'footer__develop-2');
    $develop2.textContent = 'alex89198900';
    $develop2.href = 'https://github.com/Alex89198900';
    $develop2.target = '_blank';
    const $develop3 = $('a', 'footer__develop-3');
    $develop3.textContent = 'akiroi';
    $develop3.href = 'https://github.com/akiroi';
    $develop3.target = '_blank';

    const $courseContainer = $('div', 'footer__course-container');
    const $year = $('div', 'footer__year');
    $year.textContent = '©2023';
    const $courseLink = $('a', 'footer__course-link');
    $courseLink.href = 'https://rs.school/js/';
    $courseLink.target = '_blank';
    const $courseIcon = $('span', 'footer__course-icon');

    $courseLink.append($courseIcon);
    $courseContainer.append($courseLink, $year);
    $develops.append($develop1, $develop2, $develop3);
    $footerContainer.append($courseContainer, $develops);
    $footer.append($footerContainer);

    return $footer;
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
