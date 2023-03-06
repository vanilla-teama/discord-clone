import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket from '../lib/socket';
import { appStore } from '../store/app-store';
import { Dispatch } from '../types/types';
import { translation } from '../utils/lang';
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
        (userId) => {
          socket.emit('userRegistered', { userId });
          // Router.push(RouteControllers.Friends, '', ['addfriend']);
          Router.push(RouteControllers.Chats);
        },
        (error) => {
          if ('errors' in error.data) {
            this.view.displayError(
              error.data.errors.map(({ msg }) => {
                return this.translateErrorMessage(msg);
              })
            );
          } else if ('message' in error.data) {
            this.view.displayError([this.translateErrorMessage(error.data.message)]);
          }
        }
      );
    }
  };

  translateErrorMessage(message: string): string {
    const __ = translation();
    if (/account with that email address already exists/i.test(message)) {
      return __.auth.accountAlreadyExists;
    } else if (/password must be at least 4 characters long/i.test(message)) {
      return __.auth.passwordLengthError;
    }
    return message;
  }
}

export default SignUpComponent;
