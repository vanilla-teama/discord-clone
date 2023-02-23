import App from './lib/app';
import { http } from './lib/http';
import Router from './lib/router';
import socket, { bindGlobalSocketEvents } from './lib/socket';
import ChatsScreen from './components/chats-screen';
import { appStore } from './store/app-store';
import SettingsAppearanceComponent from './components/settings-appearance';
/*
  This is for debugging
  We can use window.router to navigate through our app
*/
Object.assign(window, { app: { Router: Router, store: appStore } });

const defaultRoute = Router.createLink('');

bindGlobalSocketEvents();

(function initialize() {
  window.history.replaceState(Router.createState(defaultRoute), '', defaultRoute);
})();

async function main() {
  // await http.test();
  SettingsAppearanceComponent.setTheme();
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
