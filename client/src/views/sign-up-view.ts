import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';

class SignUpView extends View {
  static readonly classNames = {};

  $signInButton: HTMLButtonElement | null = null;
  $form: HTMLFormElement | null = null;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      throw new Error('Root element not found in index.html. Please, provide an element with id `root`');
    }
    super($root);
  }
  build(): void {
    const $container = $('div', 'sign-up');
    this.$form = $('form', 'sign-up__form');
    this.$signInButton = $('button', 'btn btn-auth');

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
}

export default SignUpView;
