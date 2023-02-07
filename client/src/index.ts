import App from './lib/app';
import Router, { RouteControllers } from './lib/router';
import socket, { bindGlobalSocketEvents } from './lib/socket';
import { CustomEvents } from './types/types';
/*
  This is for debugging
  We can use window.router to navigate through our app
*/
Object.assign(window, { app: { Router: Router } });

const defaultRoute = Router.createLink('');

bindGlobalSocketEvents();

(function initialize() {
  window.history.replaceState(Router.createState(defaultRoute), '', defaultRoute);
})();

async function main() {
  await App.run();
  socket.emit('run');
}

window.onpopstate = (event) => {
  if (event.state) {
    App.run();
  }
};

main();
