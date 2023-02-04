import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { Server } from '../types/entities';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';

class ServersBarView extends View {
  static readonly classes = {
    list: 'servers-bar__list',
    listItem: 'servers-bar__list-item',
    addingServerItem: 'server-bar__list-item_add',
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
          $item.innerHTML = `<img src="${avatar}" width="20" height="20" /><span>${name}</span>`;

          $item.onclick = () => {
            Router.push(RouteControllers.Servers, undefined, [id]);
          };
          return $item;
        })
      );

      const $addingServerItem = $('li', ServersBarView.classes.addingServerItem);
      $addingServerItem.innerHTML = `<img src="https://source.boringavatars.com/ring" width="20" height="20" /><span>Add Server</span>`;
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
