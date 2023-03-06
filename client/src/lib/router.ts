import { CustomEvents, CustomEventData } from '../types/types';
import App from './app';

export type RouterState = {
  url: string;
};

export enum RouteControllers {
  Start = 'start',
  Chats = 'chats',
  Servers = 'servers',
  Settings = 'settings',
  Friends = 'friends',
}

export type RouteActions = {
  [RouteControllers.Chats]: ChatsActions;
  [RouteControllers.Servers]: ServersActions;
  [RouteControllers.Settings]: SettingsParams;
};

export type Action<T extends RouteControllers> = T extends RouteControllers.Chats
  ? ChatsActions
  : T extends RouteControllers.Servers
  ? ServersActions
  : T extends RouteControllers.Settings
  ? SettingsParams
  : never;

export enum ChatsActions {
  Index = 'index',
  Chats = 'chats',
  Friends = 'friends',
}

export enum ServersActions {
  Index = 'index',
  Channels = 'channels',
}

export enum SettingsParams {
  Account = 'account',
  Profiles = 'profiles',
  Appearance = 'appearance',
  Keybinds = 'keybinds',
  Language = 'language',
}

export type RouterLinkFunc<R = void, C extends RouteControllers | '' = RouteControllers> = (
  controller: C | '',
  action?: C extends RouteControllers ? Action<RouteControllers> | '' : '',
  params?: UrlParams,
  search?: RouterSearch
) => R;

export type RouterSearch = Record<string, string>;

export type UrlParams = (string | number)[];

class Router {
  protected static state: RouterState = Router.createState(window.location.href);

  protected uri: string;

  protected controller: string;

  protected action: string;

  protected params: string[];

  protected search: RouterSearch = {};

  protected route: string;

  getUri(): string {
    return this.uri;
  }

  getController(): string {
    return this.controller;
  }

  getAction(): string {
    return this.action;
  }

  getParams(): string[] {
    return this.params;
  }

  getRoute(): string {
    return this.route;
  }

  getSearch(): RouterSearch {
    return this.search;
  }

  constructor() {
    const { url } = window.history.state;

    if (typeof url !== 'string') {
      throw new Error('Something went wrong');
    }
    this.uri = url.trim();

    // Get defaults
    this.route = '';
    this.controller = RouteControllers.Start;
    this.action = '';
    this.params = [];

    const uriParts = this.uri.split('?');

    this.search = Router.parseSearch(uriParts[1]);

    // Get path like /action/param1/param2
    const path = uriParts[0];

    const pathParts = path.split('/');
    pathParts.shift();

    if (pathParts.length > 0) {
      // Get controller
      if (pathParts[0]) {
        this.controller = pathParts[0].toLowerCase();
        pathParts.shift();
      }

      // Get action
      // if (pathParts[0]) {
      //   this.action = pathParts[0].toLowerCase();
      //   pathParts.shift();
      // }

      // Get params - all the rest
      this.params = pathParts;
      if (this.params.length === 1 && this.params[0] === '') {
        this.params = [];
      }
    }
  }

  static createState(url: string): RouterState {
    return { url };
  }

  static push: RouterLinkFunc = function (controller, action, params, search) {
    const route = Router.createLink(controller, action, params, search);
    Router.bindBeforePushEvent();
    window.history.pushState(Router.createState(route), '', route);
    Router.bindAfterPushEvent();
    App.run();
  };

  static bindBeforePushEvent() {
    const router = new Router();
    const [controller, action, params, search] = [
      router.getController(),
      router.getAction(),
      router.getParams(),
      router.getSearch(),
    ];
    const event = new CustomEvent(CustomEvents.BEFOREROUTERPUSH, {
      detail: { controller, action, params, search },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  static bindAfterPushEvent() {
    const router = new Router();
    const [controller, action, params, search] = [
      router.getController(),
      router.getAction(),
      router.getParams(),
      router.getSearch(),
    ];
    const event = new CustomEvent<CustomEventData[CustomEvents.AFTERROUTERPUSH]>(CustomEvents.AFTERROUTERPUSH, {
      detail: { controller, action, params, search },
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  static redirect(location: string): void {
    window.location.href = location;
  }

  static createLink: RouterLinkFunc<string> = function (controller, action?, params?, search?): string {
    const paramsStr = params ? params.map(String).join('/') : '';
    const searchStr = search && Object.keys(search).length > 0 ? `?${Router.strinfifySearch(search)}` : '';
    let url = `/${controller}`;
    if (action) {
      url += `/${action}`;
    }
    if (paramsStr) {
      url += `/${paramsStr}`;
    }
    if (searchStr) {
      url += searchStr;
    }
    return url;
  };

  static parseSearch(input: string): RouterSearch {
    if (!input) {
      return {};
    }

    const search: RouterSearch = {};
    const parts = input.split('&');

    parts.forEach((part) => {
      if (part) {
        const [key, value] = part.split('=');

        if (key) {
          if (value) {
            search[key.slice(1)] = value;
          } else {
            search[key.slice(1)] = 'true';
          }
        }
      }
    });

    return search;
  }

  static strinfifySearch(search: RouterSearch): string {
    return Object.entries(search)
      .map(([key, value]) => `_${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}

export default Router;
