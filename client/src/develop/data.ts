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
  },
  {
    id: '63dd3dd9938e35dad6409e12',
    name: 'Alexander Chornyi',
    password: '1111',
    email: 'email2@gmail.com',
    phone: '+380992234567',
    availability: Availability.DoNotDisturb,
  },
  {
    id: '63dd3de6938e35dad6409e14',
    name: 'Alexander Kiroi',
    password: '1111',
    email: 'email3@gmail.com',
    phone: '+380993234567',
    availability: Availability.Online,
  },
  {
    id: '63dede6beac45c545ad1e616',
    name: 'Serhii Serdiuk',
    password: '1111',
    email: 'email4@gmail.com',
    phone: '+380994234567',
    availability: Availability.Away,
  },
];

export const personalMessages: PersonalMessage[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    message: moment().subtract(6, 'days').calendar(),
    date: moment().subtract(6, 'days').unix(),
    responseMessageId: null,
  },
  {
    id: '2',
    fromUserId: '1',
    toUserId: '2',
    message: 'Yo man!',
    date: moment().subtract(6, 'days').unix(),
    responseMessageId: null,
  },
  {
    id: '3',
    fromUserId: '2',
    toUserId: '1',
    message: 'Yo Yo!',
    date: moment().subtract(4, 'days').unix(),
    responseMessageId: '2',
  },
  {
    id: '4',
    fromUserId: '2',
    toUserId: '3',
    message: 'Yo User 3!',
    date: moment().subtract(2, 'days').unix(),
    responseMessageId: null,
  },
  {
    id: '5',
    fromUserId: '3',
    toUserId: '2',
    message: 'Yo Yo Yo User 2!',
    date: moment().subtract(4, 'days').unix(),
    responseMessageId: '4',
  },
  {
    id: '6',
    fromUserId: '3',
    toUserId: '2',
    message: 'How is it going User 2',
    date: moment().subtract(4, 'days').unix(),
    responseMessageId: null,
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
    userId: '63dd3d9da1340145e9b74055',
    userName: 'Hlib Hodovaniuk',
  },
  {
    userId: '63dd3dd9938e35dad6409e12',
    userName: 'Alexander Chornyi',
  },
  {
    userId: '63dd3de6938e35dad6409e14',
    userName: 'Alexander Kiroi',
  },
];
