import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import ScreenView from './screen-view';
import StartBarView from './start-bar-view';
class MainView extends View {
  static readonly classNames = {};

  static $appbar: HTMLDivElement | null = null;
  static $mainContainer: HTMLDivElement | null = null;
  static $mainContent: HTMLDivElement | null = null;
  static $infobar: HTMLDivElement | null = null;

  constructor() {
    const $root = ScreenView.$main;
    if (!$root) {
      MainView.throwNoRootInTheDomError('Main');
    }
    super($root);
  }
  build(): void {
    MainView.$appbar = $('div', 'app-bar');
    MainView.$mainContainer = $('div', 'main-container');
    MainView.$mainContent = $('div', 'main-content');
    MainView.$infobar = $('div', 'info-bar');
    MainView.$mainContainer.append(MainView.$mainContent, MainView.$infobar);

    this.$container.append(MainView.$appbar, MainView.$mainContainer);
    MainView.showInfoBar();
    ScreenView.observerWidth();
  }

  static showInfoBar(): void {
    if (MainView.$mainContainer) {
      MainView.$mainContainer.classList.add('main-container_show-info-bar');
      MainView.$mainContainer.onanimationend = () => {
        if (MainView.$mainContainer) {
          MainView.$mainContainer.onanimationend = null;
          MainView.onShowInfoBar();
        }
      };
    }
  }

  static hideInfoBar(): void {
    if (MainView.$mainContainer) {
      MainView.$mainContainer.onanimationend = () => {
        if (MainView.$mainContainer) {
          MainView.$mainContainer.classList.remove('main-container_show-info-bar');
          MainView.$mainContainer.classList.remove('main-container_hiding-info-bar');
          MainView.$mainContainer.onanimationend = null;
          MainView.onHideInfoBar();
        }
      };
      MainView.$mainContainer.classList.add('main-container_hiding-info-bar');
    }
  }

  static toggleInfoBar(): void {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (ScreenView.$sideBar) ScreenView.$sideBar.classList.add('_disable');
      if (StartBarView.$burgerBtn) StartBarView.$burgerBtn.classList.remove('burger_active');
      if (MainView.$appbar) MainView.$appbar.classList.add('_active');
    }
    if (MainView.$mainContainer) {
      if (MainView.$mainContainer.classList.contains('main-container_show-info-bar')) {
        MainView.hideInfoBar();
      } else {
        MainView.showInfoBar();
      }
    }
  }

  static onShowInfoBar = (): void => {};
  static onHideInfoBar = (): void => {};

  static bindToggleInfoBar = (showHandler: () => void, hideHandler: () => void): void => {
    MainView.onShowInfoBar = showHandler;
    MainView.onHideInfoBar = hideHandler;
  };
}

export default MainView;
