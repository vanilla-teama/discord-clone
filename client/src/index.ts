import App from './lib/app';
import Router from './lib/router';
import socket, { bindGlobalSocketEvents, bindSocketEvent } from './lib/socket';
/*
  This is for debugging
  We can use window.router to navigate through our app
*/
Object.assign(window, { app: { Router: Router } });

const defaultRoute = Router.createLink('');

bindGlobalSocketEvents();

socket.on('zalupa', () => console.log('zalllllll'));

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
