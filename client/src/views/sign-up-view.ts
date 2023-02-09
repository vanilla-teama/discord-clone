import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';

class SignUpView extends View {
  static readonly classNames = {};

  $signInButton: HTMLButtonElement;
  $form: HTMLFormElement;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      SignUpView.throwNoRootInTheDomError('Root');
    }
    super($root);
    this.$form = $('form', 'sign-up__form');
    this.$signInButton = $('button', 'btn btn-auth');
  }
  build(): void {
    const $container = $('div', 'sign-up');

    this.$form.innerHTML = `<input name="name" placeholder="Your Name" />
      <input type="email" name="email" placeholder="Your E-mail" />
      <input type="tel" name="phone" placeholder="Your Phone Number" />
      <input type="password" name="password" placeholder="Your Password" />
      <button type="submit">Sign Up!</button>
    `;

    $container.append('Sign Up', this.$form, this.$signInButton);

    this.$signInButton.textContent = 'Sign In!';
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
}

export default SignUpView;
