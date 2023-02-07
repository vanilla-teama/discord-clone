import { users } from '../develop/data';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import socket, { bindEvent, createSocketEvent } from '../lib/socket';
import { appStore } from '../store/app-store';
import { Dispatch } from '../types/types';
import SignInView from '../views/sign-in-view';
import { StartScreenComponentState } from './start-screen';

class SignInComponent extends Controller<SignInView> {
  props: { setState: (state: StartScreenComponentState) => void };

  constructor(props: { setState: Dispatch<StartScreenComponentState> }) {
    super(new SignInView());
    this.props = props;

    // Initiatializing user to skip the auth screen
    appStore.user = users[1];
    if (appStore.isAuth) {
      this.onSignedIn();
    }
  }

  async init(): Promise<void> {
    this.view.render();
    this.view.bindControllerState(this.props.setState);
    this.view.bindSignIn(this.onFormSubmit);
    appStore.bindSigningIn(this.onFormSubmit);
    this.bindSocketEvents();
  }

  onFormSubmit = (data: FormData) => {
    appStore.user = users[0];
    this.onSignedIn();
  };

  onSignedIn() {
    if (appStore.user) {
      Router.push(RouteControllers.Chats);
      const socketEvent = createSocketEvent('userLoggedInClient', { data: { id: appStore.user.id } });
      socket.emit(socketEvent.name, socketEvent.data);
    }
  }

  bindSocketEvents() {
    bindEvent('userLoggedInServer', (data: unknown) => {});
  }
}

export default SignInComponent;
