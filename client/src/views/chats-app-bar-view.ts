import View from '../lib/view';
import { Chat, Availability } from '../types/entities';
import { $, getAvailability } from '../utils/functions';
import { translation } from '../utils/lang';
import MainView from './main-view';
import ScreenView from './screen-view';

class ChatsAppBarView extends View {
  static readonly classNames = {};
  chat: Chat | null;
  $userName: HTMLDivElement;
  $userStatus: HTMLDivElement;
  $showInfoBar: HTMLButtonElement;

  constructor(chat: Chat | null) {
    const $root = MainView.$appbar;
    if (!$root) {
      ChatsAppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
    this.chat = chat;
    this.$userName = $('div', 'chats-app-bar__user-name');
    this.$userStatus = $('div', ['chats-app-bar__user-status', 'tooltip']);
    this.$showInfoBar = $('button', ['chats-app-bar__profile-btn', 'tooltip']);
  }
  build(): void {
    const __ = translation();
    if (this.chat) {
      const $chatsAppBar = $('div', 'chats-app-bar');
      const $userContainer = $('div', 'chats-app-bar__user-container');
      const $iconAt = $('div', 'chats-app-bar__user-atIcon');
      const $userName = this.$userName;
      $userName.textContent = `${this.chat.userName}`;

      const $userStatus = this.$userStatus;
      $userStatus.dataset.text = getAvailability(this.chat.availability);
      $userStatus.classList.add(`chats-app-bar__user-status_${this.chat.availability}`);

      const $panelContainer = $('div', 'chats-app-bar__panel-container');
      const $showInfoBar = this.$showInfoBar;
      $showInfoBar.dataset.text = __.common.showUserProfile;

      const $search = $('input', 'chats-app-bar__search');
      $search.type = 'text';
      $search.placeholder = 'Search';
      $search.style.display = 'none';

      const $helpBtn = $('a', ['chats-app-bar__help-btn', 'tooltip']);
      $helpBtn.dataset.text = __.common.help;
      $helpBtn.href = 'https://support.discord.com/hc/en-us';
      $helpBtn.target = '_blank';

      $userContainer.append($iconAt, $userName, $userStatus);
      $panelContainer.append($showInfoBar, $search, $helpBtn);
      $chatsAppBar.append($userContainer, $panelContainer);

      this.$container.append($chatsAppBar);
    } else {
      const $notFound = $('div', 'chats-app-bar__not-found');
      $notFound.textContent = __.common.noChat;
      this.$container.append($notFound);
    }
  }

  displayUsername(name: string) {
    this.$userName.textContent = name;
  }

  displayStatus(availability: Availability) {
    const getClass = (availability: Availability): string => `chats-app-bar__user-status_${availability}`;
    if (this.chat) {
      [Availability.Online, Availability.Offline, Availability.Away, Availability.DoNotDisturb].forEach(
        (availability) => this.$userStatus.classList.remove(getClass(availability))
      );
      this.$userStatus.dataset.text = getAvailability(availability);
      this.$userStatus.classList.add(getClass(availability));
      this.chat.availability = availability;
    }
  }

  bindShowInfoBarClick = (handler: EventListener): void => {
    this.$showInfoBar.onclick = handler;
  };

  setShowInfoBarButtonShowTooltip = (): void => {
    const __ = translation();
    this.$showInfoBar.dataset.text = __.common.showUserProfile;
  };

  setShowInfoBarButtonHideTooltip = (): void => {
    const __ = translation();
    this.$showInfoBar.dataset.text = __.common.hideUserProfile;
  };
}

export default ChatsAppBarView;
