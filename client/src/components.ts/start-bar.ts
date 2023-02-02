import socket from '../lib/socket';
import { Server } from '../models/server';
import { $ } from '../utils/functions';

class StartBar {
  static readonly classNames = {
    startSidebar: 'start-sidebar',
  };

  static createElement(servers: Server[]): HTMLDivElement {
    const $container = $('div', StartBar.classNames.startSidebar);
    $container.append(
      ...servers.map(({ name, avatar }) => {
        const $item = $('li', 'lilili');
        $item.innerHTML = `<img src="${avatar}" width="20" height="20" /><span>${name}</span>`;

        $item.onclick = () => {
          console.log('item clicked');
          socket.emit('click');
        };
        return $item;
      })
    );
    return $container;
  }
}

export default StartBar;
