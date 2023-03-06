type EventListenerList = Record<
  string,
  {
    listener: EventListenerOrEventListenerObject | null;
    options: boolean | AddEventListenerOptions | undefined;
  }[]
>;

class AppEvent {
  private static instance: AppEvent;

  private _eventListenerList: EventListenerList;

  get eventListenerList(): EventListenerList {
    return this._eventListenerList;
  }

  private constructor() {
    this._eventListenerList = {};
    // this.init();
    AppEvent.instance = this;
  }

  static get Instance() {
    if (!AppEvent.instance) {
      AppEvent.instance = new AppEvent();
    }
    return AppEvent.instance;
  }

  private init() {
    const addEventListener = EventTarget.prototype.addEventListener;
    const eventListenerList = this._eventListenerList;

    EventTarget.prototype.addEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions | undefined
    ): void {
      if (options === undefined) options = false;
      addEventListener.call(this, type, listener, options);

      if (!eventListenerList[type]) eventListenerList[type] = [];
      eventListenerList[type].push({ listener, options });
    };
  }
}

export const appEvent = AppEvent.Instance;

export default AppEvent;
