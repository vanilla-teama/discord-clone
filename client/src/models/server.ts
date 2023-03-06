export interface Server {
  id: string;
  name: string;
  avatar: string;
}

class ServerModel {
  async fetchServers(): Promise<Server[]> {
    const servers: Server[] = [
      {
        id: '1',
        name: 'RS School',
        avatar: 'https://source.boringavatars.com/pixel',
      },
      {
        id: '2',
        name: 'Twin Fin',
        avatar: 'https://source.boringavatars.com/sunset',
      },
      {
        id: '3',
        name: 'Vanilla Team',
        avatar: 'https://source.boringavatars.com/beam',
      },
    ];
    return Promise.resolve(servers);
  }
}

export default ServerModel;
