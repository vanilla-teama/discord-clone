import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';

class SignInView extends View {
  static readonly classNames = {};

  $signUpButton: HTMLButtonElement;
  $form: HTMLFormElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignInView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-in__form');
    this.$signUpButton = $('button', 'btn btn-auth');
  }

  build(): void {
    const $container = $('div', 'sign-in');
    $container.append('Sign In', this.$form, this.$signUpButton);

    this.$form.innerHTML = `<input type="email" name="email" placeholder="Your E-mail" />
      <input type="password" name="password" placeholder="Your Password" />
      <button type="submit">Sign In!</button>
    `;

    this.$signUpButton.textContent = 'Sign Up!';
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
}

export default SignInView;
