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
  $footer: HTMLElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignUpView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-up__form');
    this.$signInButton = $('button', 'btn btn-auth');
    this.$errorContainer = $('div', 'sign-up__error-container');
    this.$footer = this.createFooter();
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
