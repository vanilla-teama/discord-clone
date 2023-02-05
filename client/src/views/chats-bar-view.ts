import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';

class ChatsBarView extends View {
  static readonly classes = {
    list: 'chats-bar__list',
    listItem: 'chats-bar__list-item',
  };

  constructor() {
    const $root = StartBarView.$chatBar;
    if (!$root) {
      ChatsBarView.throwNoRootInTheDomError(`ChatsBar`);
    }
    super($root);
  }
  async build(): Promise<void> {
    const $list = $('ul', ChatsBarView.classes.list);
    const $item = $('li', ChatsBarView.classes.listItem);
    const $itemImg = $('img', 'chats-bar__img');
    const $itemName = $('div', 'chats-bar__name');
    $itemName.textContent = 'Personal Messages';
    $itemImg.src = 'https://source.boringavatars.com/sunset';

    $item.onclick = () => {
      Router.push(RouteControllers.Chats);
    };
    $item.append($itemImg, $itemName);
    $list.append($item);
    this.$container.append($list);
  }
}

export default ChatsBarView;
