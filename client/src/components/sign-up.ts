import Controller from '../lib/controller';
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
  }
}

export default SignUpComponent;
