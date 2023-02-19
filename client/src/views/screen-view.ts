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
    }
  }
}
export default ScreenView;
