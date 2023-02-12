import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';

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
}

export default ScreenView;
