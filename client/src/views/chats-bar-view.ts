import Router, { Controllers } from '../lib/router';
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
    $item.innerHTML = `<img src="https://source.boringavatars.com/sunset" width="20" height="20" /><span>Personal Messages</span>`;

    $item.onclick = () => {
      Router.push(Controllers.Chats);
    };
    $list.append($item);
    this.$container.append($list);
  }
}

export default ChatsBarView;
