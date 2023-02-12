import { users } from '../develop/data';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket, { createSocketEvent } from '../lib/socket';
import { appStore } from '../store/app-store';
import { Dispatch } from '../types/types';
import SignInView from '../views/sign-in-view';
import { StartScreenComponentState } from './start-screen';

class SignInComponent extends Controller<SignInView> {
  props: { setState: (state: StartScreenComponentState) => void };

  constructor(props: { setState: Dispatch<StartScreenComponentState> }) {
    super(new SignInView());
    this.props = props;

    this.checkAuthAndRedirect();
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindControllerState(this.props.setState);
    this.view.bindSignIn(this.onFormSubmit);
    appStore.bindSigningIn(this.onFormSubmit);
  }

  onFormSubmit = async (formData: FormData): Promise<void> => {
    const email = formData.get('email');
    const password = formData.get('password');
    if (email && password && typeof email === 'string' && typeof password === 'string') {
      await appStore.logIn(email, password);
      this.onAfterLogginAttempt();
    }
  };

  onAfterLogginAttempt() {
    if (appStore.user) {
      // const socketEvent = createSocketEvent('userLoggedIn', { userId: appStore.user.id });
      socket.emit('userLoggedIn', { userId: appStore.user.id });
      Router.push(RouteControllers.Chats);
    }
  }

  checkAuthAndRedirect() {
    if (appStore.isAuth) {
      Router.push(RouteControllers.Chats);
    }
  }
}

export default SignInComponent;
