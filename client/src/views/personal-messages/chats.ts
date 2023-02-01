import StartBar from '../../components.ts/start-bar';
import View from '../../lib/view';
import { PersonalMessage } from '../../models/personal-message';
import { Server } from '../../models/server';
import { User } from '../../models/user';

export interface ChatsViewData {
  servers: Server[];
  users: User[];
  personalMessages: PersonalMessage[];
}

class ChatsView extends View {
  private data: ChatsViewData;

  constructor(data: ChatsViewData) {
    super();
    this.data = data;
  }

  build(): void {
    const servers = this.data.servers;

    const $startBar = StartBar.createElement(servers);
    this.$container.append($startBar);
  }
}

export default ChatsView;
