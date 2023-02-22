import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import MainView from './main-view';
import StartBarView from './start-bar-view';
class ScreenView extends View {
  static readonly classNames = {
    startBar: 'start-bar',
    sideBar: 'sidebar',
    main: 'main',
    portal: 'portal',
  };

  static $startBar: HTMLDivElement | null = null;
  static $sideBar: HTMLDivElement | null = null;
  static $main: HTMLDivElement | null = null;
  static $portal: HTMLDivElement | null = null;

  constructor() {
    const $root = document.getElementById('root');
    if (!$root) {
      ScreenView.throwNoRootInTheDomError('Root');
    }
    super($root);
  }
  build(): void {
    ScreenView.$startBar = $('div', ScreenView.classNames.startBar);
    ScreenView.$sideBar = $('div', ScreenView.classNames.sideBar);
    ScreenView.$main = $('div', ScreenView.classNames.main);
    ScreenView.$portal = $('div', ScreenView.classNames.portal);
    this.$container.append(ScreenView.$startBar, ScreenView.$sideBar, ScreenView.$main, ScreenView.$portal);

    this.bindHotKeys();
  }
  static showSideBar(): void {
    if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.toggle('_disable');
    if (StartBarView.$burgerBtn) StartBarView.$burgerBtn.classList.toggle('burger_active');
    if (MainView.$appbar) MainView.$appbar.classList.toggle('_active');
    if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.toggle('_disable');
    if (window.matchMedia('(max-width: 1000px)').matches) {
      if (MainView.$mainContainer && MainView.$mainContainer.classList.contains('main-container_show-info-bar')) {
        MainView.hideInfoBar();
      }
    }
    if (window.matchMedia('(min-width: 992px)').matches) {
      if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.toggle('_disable');
    }
  }

  static observerWidth(): void {
    ScreenView.hideMenu();
    window.addEventListener('resize', (event) => {
      ScreenView.hideMenu();
    });
  }

  static hideMenu(): void {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (StartBarView.$burgerBtn) StartBarView.$burgerBtn.classList.remove('burger_active');
      if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.add('_disable');
      if (MainView.$appbar) MainView.$appbar.classList.add('_active');
      if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.add('_disable');
      if (MainView.$mainContainer) {
        MainView.$mainContainer.classList.remove('main-container_show-info-bar');
        MainView.$mainContainer.classList.remove('main-container_hiding-info-bar');
        MainView.$mainContainer.onanimationend = null;
      }
    } else {
      if (window.matchMedia('(min-width: 992px)').matches) {
        if (StartBarView.$burgerBtn) StartBarView.$burgerBtn.classList.add('burger_active');
        if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.remove('_disable');
        if (MainView.$appbar) MainView.$appbar.classList.remove('_active');
        if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.remove('_disable');
      }
    }
  }

  bindHotKeys(): void {
    window.removeEventListener('keyup', ScreenView.onKeyEvent);
    window.addEventListener(
      'keyup',
      (ScreenView.onKeyEvent = async (event) => {
        if (!event.key) {
          return;
        }
        const key = event.key.toLowerCase();
        if (key !== 'arrowup' && key !== 'arrowdown') {
          return;
        }
        if (event.altKey) {
          if (event.ctrlKey) {
            await this.onCtrlAltArrowKey(key);
          } else {
            await this.onAltArrowKey(key);
          }
        }
      })
    );
  }

  static onKeyEvent = (event: KeyboardEvent): void => {};

  onAltArrowKey = async (key: 'arrowup' | 'arrowdown'): Promise<void> => {};

  onCtrlAltArrowKey = async (key: 'arrowup' | 'arrowdown'): Promise<void> => {};

  bindOnAltArrowKey = (handler: (key: 'arrowup' | 'arrowdown') => Promise<void>): void => {
    this.onAltArrowKey = handler;
  };

  bindOnCtrlAltArrowKey = (handler: (key: 'arrowup' | 'arrowdown') => Promise<void>): void => {
    this.onCtrlAltArrowKey = handler;
  };
}
export default ScreenView;
