import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import MainView from './main-view';
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
    this.observerWidth();
    ScreenView.$startBar = $('div', ScreenView.classNames.startBar);
    ScreenView.$sideBar = $('div', ScreenView.classNames.sideBar);
    ScreenView.$main = $('div', ScreenView.classNames.main);
    ScreenView.$portal = $('div', ScreenView.classNames.portal);
    this.$container.append(ScreenView.$startBar, ScreenView.$sideBar, ScreenView.$main, ScreenView.$portal);
  }
  static showSideBar(): void {
    if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.remove('_disable');
    if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.remove('_disable');
    if (window.matchMedia('(max-width: 1000px)').matches) {
      if (MainView.$mainContainer && MainView.$mainContainer.classList.contains('main-container_show-info-bar')) {
        MainView.hideInfoBar();
      }
    }
  }

  static hideSideBar(): void {
    if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.add('_disable');
    if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.add('_disable');
  }
  observerWidth(): void {
    window.addEventListener('resize', (event) => {
      if (window.matchMedia('(max-width: 1000px)').matches) {
        if (ScreenView.$sideBar !== null) ScreenView.$sideBar.classList.add('_disable');
        if (MainView.$mainContainer !== null) MainView.$mainContainer.classList.add('_disable');
        if (MainView.$mainContainer) {
          MainView.$mainContainer.classList.remove('main-container_show-info-bar');
          MainView.$mainContainer.classList.remove('main-container_hiding-info-bar');
          MainView.$mainContainer.onanimationend = null;
        }
      }
    });
  }
}
export default ScreenView;
