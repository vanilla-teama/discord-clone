import { Availability, Chat, PersonalMessage, Server, User } from '../types/entities';
import moment from '../lib/moment';

export const users: User[] = [
  {
    id: '63dd3d9da1340145e9b74055',
    name: 'Hlib Hodovaniuk',
    password: '1111333',
    email: 'gleb.godovanyuk@gmail.com',
    phone: '+380991234567',
    availability: Availability.Offline,
    chats: null,
    friends: [],
    invitesTo: [],
    invitesFrom: [],
  },
  {
    id: '63dd3dd9938e35dad6409e12',
    name: 'Alexander Chornyi',
    password: '1111',
    email: 'email2@gmail.com',
    phone: '+380992234567',
    availability: Availability.DoNotDisturb,
    chats: null,
    friends: [],
    invitesTo: [],
    invitesFrom: [],
  },
  {
    id: '63dd3de6938e35dad6409e14',
    name: 'Alexander Kiroi',
    password: '1111',
    email: 'email3@gmail.com',
    phone: '+380993234567',
    availability: Availability.Online,
    chats: null,
    friends: [],
    invitesTo: [],
    invitesFrom: [],
  },
  {
    id: '63dede6beac45c545ad1e616',
    name: 'Serhii Serdiuk',
    password: '1111',
    email: 'email4@gmail.com',
    phone: '+380994234567',
    availability: Availability.Away,
    chats: [],
    friends: [],
    invitesTo: [],
    invitesFrom: [],
  },
];

export const personalMessages: PersonalMessage[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    message: moment().subtract(6, 'days').calendar(),
    date: moment().subtract(6, 'days').unix(),
    responsedToMessageId: null,
    responsedToMessage: null,
  },
  {
    id: '2',
    fromUserId: '1',
    toUserId: '2',
    message: 'Yo man!',
    date: moment().subtract(6, 'days').unix(),
    responsedToMessageId: null,
    responsedToMessage: null,
  },
  {
    id: '3',
    fromUserId: '2',
    toUserId: '1',
    message: 'Yo Yo!',
    date: moment().subtract(4, 'days').unix(),
    responsedToMessageId: '2',
    responsedToMessage: null,
  },
  {
    id: '4',
    fromUserId: '2',
    toUserId: '3',
    message: 'Yo User 3!',
    date: moment().subtract(2, 'days').unix(),
    responsedToMessageId: null,
    responsedToMessage: null,
  },
  {
    id: '5',
    fromUserId: '3',
    toUserId: '2',
    message: 'Yo Yo Yo User 2!',
    date: moment().subtract(4, 'days').unix(),
    responsedToMessageId: '4',
    responsedToMessage: null,
  },
  {
    id: '6',
    fromUserId: '3',
    toUserId: '2',
    message: 'How is it going User 2',
    date: moment().subtract(4, 'days').unix(),
    responsedToMessageId: null,
    responsedToMessage: null,
  },
];

// export const servers: Server[] = [
//   {
//     id: '1',
//     name: 'RS School',
//     image: Buffer.from(''),
//   },
//   {
//     id: '2',
//     name: 'Twin Fin',
//     image: Buffer.from(''),
//   },
//   {
//     id: '3',
//     name: 'Vanilla Team',
//     image: Buffer.from(''),
//   },
// ];

export const chats: Chat[] = [
  {
    id: '63dd3dd9938e35dad6409e12',
    userId: '63dd3d9da1340145e9b74055',
    userName: 'Hlib Hodovaniuk',
    availability: Availability.Away,
  },
  {
    id: '63dd3d9da1340145e9b74055',
    userId: '63dd3dd9938e35dad6409e12',
    userName: 'Alexander Chornyi',
    availability: Availability.Away,
  },
  {
    id: '63dd3de6938e35dad6409e14',
    userId: '63dd3de6938e35dad6409e14',
    userName: 'Alexander Kiroi',
    availability: Availability.Away,
  },
];
