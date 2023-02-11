import View from '../lib/view';
import { Chat, Availability } from '../types/entities';
import { $ } from '../utils/functions';
import MainView from './main-view';

class ChatsAppBarView extends View {
  static readonly classNames = {};

  chat: Chat | null;
  $userStatus: HTMLDivElement;

  constructor(chat: Chat | null) {
    const $root = MainView.$appbar;
    if (!$root) {
      ChatsAppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
    this.chat = chat;
    this.$userStatus = $('div', ['chats-app-bar__user-status', 'tooltip']);
  }
  build(): void {
    if (this.chat) {
      const $chatsAppBar = $('div', 'chats-app-bar');
      const $userContainer = $('div', 'chats-app-bar__user-container');
      const $iconAt = $('div', 'chats-app-bar__user-atIcon');
      const $userName = $('div', 'chats-app-bar__user-name');
      $userName.textContent = `${this.chat.userName}`;

      const $userStatus = this.$userStatus;
      $userStatus.dataset.text = 'Online';
      $userStatus.classList.add(`chats-app-bar__user-status_${this.chat.availability}`);

      const $panelContainer = $('div', 'chats-app-bar__panel-container');
      const $showProfileBtn = $('button', ['chats-app-bar__profile-btn', 'tooltip']);
      $showProfileBtn.dataset.text = 'Show user profile';

      const $search = $('input', 'chats-app-bar__search');
      $search.type = 'text';
      $search.placeholder = 'Search';

      const $helpBtn = $('button', ['chats-app-bar__help-btn', 'tooltip']);
      $helpBtn.dataset.text = 'Help';

      $userContainer.append($iconAt, $userName, $userStatus);
      $panelContainer.append($showProfileBtn, $search, $helpBtn);
      $chatsAppBar.append($userContainer, $panelContainer);

      this.$container.append($chatsAppBar);
    } else {
      this.$container.append('NO CHAT FOR APPBAR!');
    }
  }

  displayStatus(availability: Availability) {
    const getClass = (availability: Availability): string => `chats-app-bar__user-status_${availability}`;
    if (this.chat) {
      [Availability.Online, Availability.Offline, Availability.Away, Availability.DoNotDisturb].forEach(
        (availability) => this.$userStatus.classList.remove(getClass(availability))
      );
      this.$userStatus.dataset.text = availability;
      this.$userStatus.classList.add(getClass(availability));
      this.chat.availability = availability;
    }
  }
}

export default ChatsAppBarView;
