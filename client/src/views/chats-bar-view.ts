import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';
import * as discord from '../assets/icons/discord.svg';
import { translation } from '../utils/lang';

class ChatsBarView extends View {
  static readonly classes = {
    list: 'chats-bar__list',
    listItem: 'chats-bar__list-item',
    listItemActive: 'chats-bar__list-item_active',
  };

  $item: HTMLLIElement;

  constructor() {
    const $root = StartBarView.$chatBar;
    if (!$root) {
      ChatsBarView.throwNoRootInTheDomError(`ChatsBar`);
    }
    super($root);
    this.$item = $('li', ChatsBarView.classes.listItem);
  }
  async build(): Promise<void> {
    const __ = translation();
    const $topContainer = $('div', 'chats-bar__top-container');
    const $list = $('ul', ChatsBarView.classes.list);
    this.$item = $('li', ChatsBarView.classes.listItem);
    const $itemImg = $('img', 'chats-bar__img');
    const $itemName = $('div', 'chats-bar__name');
    $itemName.textContent = __.startbar.personalMessages;
    $itemImg.src = discord.default;

    this.$item.onclick = () => {
      Router.push(RouteControllers.Chats);
    };
    this.$item.append($itemImg, $itemName);
    $list.append(this.$item);

    this.$container.append($topContainer, $list);
  }

  toggleActiveStatus(isActive: boolean) {
    this.$item.classList.toggle(ChatsBarView.classes.listItemActive, isActive);
  }
}

export default ChatsBarView;
