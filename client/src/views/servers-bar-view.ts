import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { Server } from '../types/entities';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';

class ServersBarView extends View {
  static readonly classes = {
    list: 'servers-bar__list',
    listItem: 'servers-bar__list-item',
    listItemActive: 'servers-bar__list-item_active',
    addingServerItem: 'servers-bar__list-item_add',
  };

  $serverList: HTMLUListElement;
  serverListMap: Map<HTMLLIElement, { server: Server }>;

  constructor() {
    const $root = StartBarView.$serversBar;
    if (!$root) {
      ServersBarView.throwNoRootInTheDomError(`ServersBar`);
    }
    super($root);
    this.$serverList = $('ul', ServersBarView.classes.list);
    this.serverListMap = new Map();
  }

  build(): void {
    this.$container.append(this.$serverList);
  }

  displayServers(servers: Server[]) {
    this.$serverList.innerHTML = '';
    servers.forEach((server) => {
      const $item = this.createServerItem(server);
      this.$serverList.append($item);
      this.onAppendServerItem($item, server);
    });

    this.$serverList.append(this.createAddServerItem());
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

  toggleActiveStatus(serverId: string | undefined) {
    this.serverListMap.forEach((data, $item) => {
      $item.classList.remove(ServersBarView.classes.listItemActive);
      if (data.server.id === serverId) {
        $item.classList.add(ServersBarView.classes.listItemActive);
      }
    });
  }

  private createServerItem({ id, name, avatar }: Server): HTMLLIElement {
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
  }

  private createAddServerItem() {
    const $item = $('li', ServersBarView.classes.addingServerItem);
    const $addingServerItemImg = $('span', 'servers-bar__img-add');
    const $addingServerItemName = $('span', 'servers-bar__name');
    $addingServerItemName.textContent = `Add Server`;

    $item.append($addingServerItemImg, $addingServerItemName);
    return $item;
  }

  private onAppendServerItem($item: HTMLLIElement, server: Server) {
    this.serverListMap.set($item, { server });
  }
}

export default ServersBarView;
