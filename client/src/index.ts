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

document.addEventListener(CustomEvents.BEFOREROUTERPUSH, (event) => {
  console.log('before push');
  console.log(event);
});

document.addEventListener(CustomEvents.AFTERROUTERPUSH, (event) => {
  console.log('after push');
  console.log(event);
});

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
