export interface PersonalMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  responsedMessageId: string | null;
  message: string;
}

class PersonalMessageModel {
  async fetchPersonalMessages(): Promise<PersonalMessage[]> {
    const messages: PersonalMessage[] = [
      {
        id: '1',
        fromUserId: '1',
        toUserId: '2',
        responsedMessageId: null,
        message: 'Hello User with Id 2',
      },
      {
        id: '2',
        fromUserId: '1',
        toUserId: '2',
        responsedMessageId: null,
        message: 'How is it going?',
      },
      {
        id: '3',
        fromUserId: '2',
        toUserId: '1',
        responsedMessageId: '2',
        message: 'Slava Ukraini!',
      },
    ];

    return Promise.resolve(messages);
  }
}

export default PersonalMessageModel;
