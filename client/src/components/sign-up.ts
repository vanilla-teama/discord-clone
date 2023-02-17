import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Dispatch } from '../types/types';
import SignUpView from '../views/sign-up-view';
import { StartScreenComponentState } from './start-screen';

class SignUpComponent extends Controller<SignUpView> {
  props: { setState: (state: StartScreenComponentState) => void };

  constructor(props: { setState: Dispatch<StartScreenComponentState> }) {
    super(new SignUpView());
    this.props = props;
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindControllerState(this.props.setState);
    this.view.bindSignUp(this.onFormSubmit);
  }

  onFormSubmit = async (formData: FormData): Promise<void> => {
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    if (
      email &&
      password &&
      name &&
      typeof email === 'string' &&
      typeof password === 'string' &&
      typeof name === 'string'
    ) {
      await appStore.register(
        { email, password, name },
        () => {
          Router.push(RouteControllers.Chats);
        },
        (error) => {
          if ('errors' in error.data) {
            this.view.displayError(error.data.errors.map(({ msg }) => msg));
          } else if ('message' in error.data) {
            this.view.displayError([error.data.message]);
          }
        }
      );
    }
  };
}

export default SignUpComponent;
