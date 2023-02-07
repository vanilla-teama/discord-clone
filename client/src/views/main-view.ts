import { StartScreenComponentState } from '../components/start-screen';
import View from '../lib/view';
import { Dispatch } from '../types/types';
import { $ } from '../utils/functions';
import ScreenView from './screen-view';

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
  }
}

export default MainView;
