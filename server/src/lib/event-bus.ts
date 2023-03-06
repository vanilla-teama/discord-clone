interface IEventBus {
  channels: Record<string, ((...args: unknown[]) => unknown)[]>;
  subscribe: (channelName: string, listener: (...args: unknown[]) => unknown) => void;
  publish: (channelName: string, data: unknown) => void;
}

const EventBus: IEventBus = {
  channels: {},
  subscribe(channelName, listener) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = [];
    }
    this.channels[channelName].push(listener);
  },

  publish(channelName, data: unknown) {
    const channel = this.channels[channelName];
    if (!channel || !channel.length) {
      return;
    }

    channel.forEach((listener) => listener(data));
  },
};

export default EventBus;
