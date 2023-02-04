import App from '../lib/app';
import Controller from '../lib/controller';
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
    this.renderChild();
  }

  renderChild() {
    if (this.state.render === 'signin') {
      new SignInComponent({ setState: this.setState }).init();
    } else {
      new SignUpComponent({ setState: this.setState }).init();
    }
  }
}

export default StartScreen;
