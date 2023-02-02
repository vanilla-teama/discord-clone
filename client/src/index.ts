import App from './lib/app';
import Router, { Controllers } from './lib/router';

const defaultRoute = Router.createLink(Controllers.Chats);

(function initialize() {
  window.history.replaceState(Router.createState(defaultRoute), '', defaultRoute);
})();

async function main() {
  await App.run();
}

window.onpopstate = (event) => {
  if (event.state) {
    App.run();
  }
};

main();
