import Controller from '../lib/controller';
import socket, { emitPersonalMessage } from '../lib/socket';
import { IncomingPersonalMessage, appStore } from '../store/app-store';
import { Chat, PersonalMessage } from '../types/entities';
import ChatsMainContentView, { RenderedPersonalMessage } from '../views/chats-main-content-view';
import ChatsScreen from './chats-screen';
import MessageFastMenu from './message-fast-menu';

class ChatsMainContentComponent extends Controller<ChatsMainContentView> {
  constructor() {
    super(new ChatsMainContentView(ChatsScreen.chat));
    this.chat = ChatsScreen.chat;
    this.fastMenusMap = new Map();
    this.editedMessage = null;
  }

  chat: Chat | null;
  fastMenusMap: Map<HTMLElement, { fastMenu: MessageFastMenu; message: RenderedPersonalMessage }>;
  editedMessage: RenderedPersonalMessage | null;

  async init(): Promise<void> {
    if (!appStore.user) {
      throw Error('User is not defined');
    }

    this.view.render();

    if (this.chat) {
      await this.fetchMessages();
      this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
      this.view.bindMessageEvent(this.handleSendMessage);
      appStore.bindPersonalMessageListChanged(this.onMessageListChange);
      this.onSocketPersonalMessage();
      this.view.bindMessageHover(this.showFastMenu);
      this.view.bindDestroyFastMenu(this.destroyFastMenu);
      this.view.bindEditMessageFormSubmit(this.onEditMessageFormSubmit);
      MessageFastMenu.bindShowEditForm(this.showEditForm);
    }
  }

  private async fetchMessages(): Promise<void> {
    if (!appStore.user || !this.chat) {
      return;
    }
    await appStore.fetchPersonalMessages(appStore.user.id, this.chat.userId);
  }

  onMessageListChange = async (messages: RenderedPersonalMessage[]): Promise<void> => {
    this.view.displayMessages(messages);
  };

  handleSendMessage = async (messageText: string): Promise<void> => {
    if (!appStore.user || !this.chat) {
      return;
    }
    const message: IncomingPersonalMessage = {
      fromUserId: appStore.user.id,
      toUserId: this.chat.userId,
      date: Date.now(),
      responsedToMessageId: null,
      message: messageText,
      responsedToMessage: null,
    };
    await appStore.addPersonalMessage(message);
    emitPersonalMessage(message);
  };

  onSocketPersonalMessage() {
    socket.removeAllListeners('personalMessage');
    socket.on('personalMessage', async ({ fromUserId, toUserId }) => {
      if (!this.chat) {
        return;
      }
      await this.fetchMessages();
      await this.onMessageListChange(appStore.getFormattedRenderedPersonalMessages());
    });
  }

  showFastMenu = async (
    $fastMenuContainer: HTMLElement,
    $message: HTMLLIElement,
    message: RenderedPersonalMessage
  ): Promise<void> => {
    const fastMenu = new MessageFastMenu($fastMenuContainer, $message, message);
    await fastMenu.init();
    this.fastMenusMap.set($fastMenuContainer, { fastMenu, message });
  };

  destroyFastMenu = ($fastMenuContainer: HTMLElement) => {
    const data = this.fastMenusMap.get($fastMenuContainer);
    if (data) {
      data.fastMenu.destroy();
    }
  };

  showEditForm = ($container: HTMLLIElement): void => {
    this.view.displayEditMessageForm($container);
  };

  onEditMessageFormSubmit = async (formData: FormData, $message: HTMLLIElement): Promise<void> => {
    const id = formData.get('id');
    const message = formData.get('message');
    if (!id || !message || typeof id !== 'string' || typeof message !== 'string') {
      return;
    }
    appStore.bindPersonalMessageChanged((message: RenderedPersonalMessage) => {
      this.view.editMessageContent($message, message);
    });
    await appStore.editPersonalMessage(id, message);
  };
}

export default ChatsMainContentComponent;
