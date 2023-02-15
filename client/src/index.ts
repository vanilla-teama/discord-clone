import App from './lib/app';
import { http } from './lib/http';
import Router from './lib/router';
import socket, { bindGlobalSocketEvents } from './lib/socket';
import ChatsScreen from './components/chats-screen';
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
  await http.test();
  await App.run();
  socket.emit('run');
  ChatsScreen.bindRouteChanged();
}

window.addEventListener('popstate', (event) => {
  if (event.state) {
    App.run();
  }
});

main();
