import App from './lib/app';
import Router, { Controllers } from './lib/router';
import socket from './lib/socket';

const defaultRoute = Router.createLink(Controllers.Chats);

socket.on('connect', function () {
  console.log('connect');
});

socket.on('disconnect', function (message: string) {
  console.log('disconnect ' + message);
});

socket.on('click', () => {
  console.log('socket click');
});

socket.on('clicked', (data: unknown) => {
  console.log('socket clicked', data);
});

socket.on('id', (id: unknown) => {
  console.log('socket id', id);
});

socket.on('clients', (clients: unknown) => {
  console.log('on clients', clients);
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
