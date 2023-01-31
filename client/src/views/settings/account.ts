import View from '../../lib/view';

class AccountView extends View {
  build(): void {
    this.$container.append('This is Accounts!');
  }
}

export default AccountView;
