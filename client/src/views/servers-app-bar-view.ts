import View from '../lib/view';
import { $ } from '../utils/functions';
import MainView from './main-view';
import { Channel } from '../types/entities';

class ServersAppBarView extends View {
  static readonly classNames = {};

  $showInfoBar: HTMLButtonElement;
  $channelName: HTMLDivElement;

  constructor() {
    const $root = MainView.$appbar;
    if (!$root) {
      ServersAppBarView.throwNoRootInTheDomError('App-bar');
    }
    super($root);
    this.$showInfoBar = $('button', ['servers-app-bar__members-btn', 'tooltip']);
    this.$channelName = $('div', 'servers-app-bar__channel-name');
  }
  build(): void {
    const channelsFake: Channel[] = [
      {
        id: 'efef',
        serverId: '12',
        name: 'RS',
      },
      {
        id: 'efef',
        serverId: '45',
        name: 'SCSS',
      },
    ];

    const $serversAppBar = $('div', 'servers-app-bar');
    const $channelContainer = $('div', 'servers-app-bar__channel-container');
    const $iconHash = $('div', 'servers-app-bar__hash-icon');
    const $channelName = this.$channelName;
    $channelName.textContent = `No channel`;

    const $panelContainer = $('div', 'servers-app-bar__panel-container');
    const $showInfoBar = this.$showInfoBar;
    $showInfoBar.dataset.text = 'Show member list';

    const $search = $('input', 'servers-app-bar__search');
    $search.type = 'text';
    $search.placeholder = 'Search';

    const $helpBtn = $('button', ['servers-app-bar__help-btn', 'tooltip']);
    $helpBtn.dataset.text = 'Help';

    $panelContainer.append($showInfoBar, $search, $helpBtn);
    $channelContainer.append($iconHash, $channelName);
    $serversAppBar.append($channelContainer, $panelContainer);

    this.$container.append($serversAppBar);
  }

  displayChannelName(name: string): void {
    this.$channelName.textContent = name;
  }

  bindShowInfoBarClick = (handler: EventListener): void => {
    this.$showInfoBar.onclick = handler;
  };

  setShowInfoBarButtonShowTooltip = (): void => {
    this.$showInfoBar.dataset.text = 'Show members list';
  };

  setShowInfoBarButtonHideTooltip = (): void => {
    this.$showInfoBar.dataset.text = 'Hide members list';
  };
}

export default ServersAppBarView;
