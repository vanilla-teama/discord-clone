import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { Server } from '../types/entities';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';

class ServersBarView extends View {
  static readonly classes = {
    list: 'servers-bar__list',
    listItem: 'servers-bar__list-item',
    addingServerItem: 'servers-bar__list-item_add',
  };

  $serverList: HTMLUListElement | null = null;

  constructor() {
    const $root = StartBarView.$serversBar;
    if (!$root) {
      ServersBarView.throwNoRootInTheDomError(`ServersBar`);
    }
    super($root);
  }

  build(): void {
    const $list = $('ul', ServersBarView.classes.list);
    this.$serverList = $list;

    this.$container.append($list);
  }

  displayServers(servers: Server[]) {
    if (this.$serverList) {
      while (this.$serverList.firstChild) {
        this.$serverList.removeChild(this.$serverList.firstChild);
      }
      this.$serverList.append(
        ...servers.map(({ id, name, avatar }) => {
          const $item = $('li', ServersBarView.classes.listItem);
          const $itemImg = $('img', 'servers-bar__img');
          const $itemName = $('div', 'servers-bar__name');
          $itemName.textContent = `${name}`;
          $itemImg.src = `${avatar}`;
          $item.append($itemImg, $itemName);

          $item.onclick = () => {
            Router.push(RouteControllers.Servers, undefined, [id]);
          };
          return $item;
        })
      );

      const $addingServerItem = $('li', ServersBarView.classes.addingServerItem);
      const $addingServerItemImg = $('span', 'servers-bar__img-add');
      const $addingServerItemName = $('span', 'servers-bar__name');
      $addingServerItemName.textContent = `Add Server`;

      $addingServerItem.append($addingServerItemImg, $addingServerItemName);
      this.$serverList.append($addingServerItem);
    }
  }

  bindAddServer(handler: (server: Partial<Server>) => void) {
    this.$serverList?.addEventListener('click', (event) => {
      const $target = event.target;
      if (!($target instanceof HTMLElement) || !$target.closest(`.${ServersBarView.classes.addingServerItem}`)) {
        return;
      }

      const server: Partial<Server> = {
        name: `New Server #${Math.ceil(Math.random() * 100)}`,
        avatar: 'https://source.boringavatars.com',
      };

      handler(server);
    });
  }
}

export default ServersBarView;
