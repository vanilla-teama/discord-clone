import App from '../lib/app';
import Controller from '../lib/controller';
import Router, { RouteControllers } from '../lib/router';
import { appStore } from '../store/app-store';
import { Dispatch } from '../types/types';
import StartScreenView from '../views/start-screen-view';
import SignInComponent from './sign-in';
import SignUpComponent from './sign-up';

export interface StartScreenComponentState {
  render: 'signin' | 'signup';
}

class StartScreen extends Controller<StartScreenView> {
  private state: StartScreenComponentState = {
    render: 'signin',
  };

  setState: Dispatch<StartScreenComponentState> = (state) => {
    this.state = state;
    this.renderChild();
  };

  constructor() {
    super(new StartScreenView());
  }

  async init(): Promise<void> {
    // await this.checkAuthAndRedirect();
    this.renderChild();
  }

  renderChild() {
    if (this.state.render === 'signin') {
      new SignInComponent({ setState: this.setState }).init();
    } else {
      new SignUpComponent({ setState: this.setState }).init();
    }
  }

  async checkAuthAndRedirect(): Promise<void> {
    const isAuth = await appStore.checkAuth();
    if (isAuth) {
      Router.push(RouteControllers.Chats);
    }
  }
}

export default StartScreen;
