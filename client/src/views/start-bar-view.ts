import View from '../lib/view';
import { $ } from '../utils/functions';
import ChatsScreenView from './chats-screen-view';
import ScreenView from './screen-view';
import ServersScreenView from './servers-screen-view';

class StartBarView extends View {
  static readonly classes = {
    chatsBar: 'start-bar__chats-bar',
    serversBar: 'start-bar__servers-bar',
    burger: 'burger burger_active',
    burgerLineFirst: 'burger__line burger__line_first',
    burgerLineSecond: 'burger__line burger__line_second',
    burgerLineThird: 'burger__line burger__line_third',
    burgerLineFourth: 'burger__line burger__line_fourth',
  };

  static $chatBar: HTMLDivElement | null;
  static $serversBar: HTMLDivElement | null;
  static $burgerBtn: HTMLDivElement | null;

  constructor() {
    const $root = ScreenView.$startBar;

    if (!$root) {
      StartBarView.throwNoRootInTheDomError(`StartBar`);
    }
    super($root);
    StartBarView.$chatBar = null;
    StartBarView.$serversBar = null;
  }
  async build(): Promise<void> {
    const $startBarContainer = $('div', 'start-bar__container');
    const $lineFirst = $('span', StartBarView.classes.burgerLineFirst);
    const $lineSecond = $('span', StartBarView.classes.burgerLineSecond);
    const $lineThird = $('span', StartBarView.classes.burgerLineThird);
    const $lineFourth = $('span', StartBarView.classes.burgerLineFourth);
    StartBarView.$burgerBtn = $('div', StartBarView.classes.burger);
    StartBarView.$chatBar = $('div', StartBarView.classes.chatsBar);
    StartBarView.$serversBar = $('div', StartBarView.classes.serversBar);
    StartBarView.$burgerBtn.append($lineFirst, $lineSecond, $lineThird, $lineFourth);
    const $separator = $('div', 'start-bar__separator');
    const $separatorUp = $('div', ['start-bar__separator', 'start-bar__separator_up']);

    $startBarContainer.append(
      StartBarView.$burgerBtn,
      $separatorUp,
      StartBarView.$chatBar,
      $separator,
      StartBarView.$serversBar
    );
    this.$container.append($startBarContainer);
  }

  bindShowSideBarClick = (handler: EventListener): void => {
    if (StartBarView.$burgerBtn) StartBarView.$burgerBtn.onclick = handler;
  };
}

export default StartBarView;
