import Router, { RouteControllers } from '../lib/router';
import View from '../lib/view';
import { Server } from '../types/entities';
import { $ } from '../utils/functions';
import StartBarView from './start-bar-view';
import * as upload from '../assets/flags/flag-eng.png';

class ServersBarView extends View {
  static readonly classes = {
    list: 'servers-bar__list',
    listItem: 'servers-bar__list-item',
    listItemActive: 'servers-bar__list-item_active',
    addingServerItem: 'servers-bar__list-item_add',
  };

  $serverList: HTMLUListElement;
  $addServerButton: HTMLLIElement;
  serverListMap: Map<HTMLLIElement, { server: Server }>;

  constructor() {
    const $root = StartBarView.$serversBar;
    if (!$root) {
      ServersBarView.throwNoRootInTheDomError(`ServersBar`);
    }
    super($root);
    this.$serverList = $('ul', ServersBarView.classes.list);
    this.serverListMap = new Map();
    this.$addServerButton = this.createAddServerButton();
  }

  build(): void {
    this.$container.append(this.$serverList);
  }

  displayServers(servers: Server[]): void {
    this.$serverList.innerHTML = '';

    const serversFake: Server[] = [
      {
        name: 'server2',
        image: '/src/assets/icons/discord.svg',
        id: '123',
      },
      {
        name: 'server1',
        image: '',
        id: '456',
      },
    ];

    //serversFake.forEach((server) => {
    //  const $item = this.createServerItem(server);
    //  this.$serverList.append($item);
    //  //this.onAppendServerItem($item, server);
    //});
    servers.forEach((server) => {
      const $item = this.createServerItem(server);
      this.$serverList.append($item);
      this.onAppendServerItem($item, server);
    });

    this.$serverList.append(this.$addServerButton);
    this.bindShowModal();
  }

  toggleActiveStatus(serverId: string | undefined): void {
    this.serverListMap.forEach((data, $item) => {
      $item.classList.remove(ServersBarView.classes.listItemActive);
      if (data.server.id === serverId) {
        $item.classList.add(ServersBarView.classes.listItemActive);
      }
    });
  }

  bindShowModal(): void {
    this.$addServerButton.removeEventListener('click', this.onShowServerForm);
    this.$addServerButton.addEventListener('click', this.onShowServerForm);
  }

  bindShowServerForm(handler: (mode: 'create' | 'edit') => EventListener): void {
    this.onShowServerForm = handler('create');
  }

  onShowServerForm: EventListener = () => {};

  private createServerItem({ id, name, image }: Server): HTMLLIElement {
    const $item = $('li', ServersBarView.classes.listItem);
    const $itemImg = $('img', 'servers-bar__img');
    $itemImg.dataset.name = name.slice(0, 1).toUpperCase();
    $itemImg.alt = name;
    const $itemName = $('div', 'servers-bar__name');
    $itemName.textContent = `${name}`;

    if (image) {
      $itemImg.src = `data:image/png;base64, ${image}`;
    }
    $item.append($itemImg, $itemName);

    $item.onclick = () => {
      Router.push(RouteControllers.Servers, undefined, [id]);
    };
    return $item;
  }

  private createAddServerButton(): HTMLLIElement {
    const $item = $('li', ServersBarView.classes.addingServerItem);
    const $addingServerItemImg = $('span', 'servers-bar__img-add');
    const $addingServerItemName = $('span', 'servers-bar__name');
    $addingServerItemName.textContent = `Add Server`;

    $item.append($addingServerItemImg, $addingServerItemName);
    return $item;
  }

  private onAppendServerItem($item: HTMLLIElement, server: Server): void {
    this.serverListMap.set($item, { server });
  }
}

export default ServersBarView;
