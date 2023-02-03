import { PersonalMessage, Server, User } from '../types/entities';
import moment from '../lib/moment';

export const users: User[] = [
  {
    id: '1',
    name: 'Hlib Hodovaniuk',
    email: 'email1@gmail.com',
    password: '1111',
    phone: '+380991234567',
  },
  {
    id: '2',
    name: 'Alexander Chornyi',
    email: 'email2@gmail.com',
    password: '1111',
    phone: '+380991234567',
  },
  {
    id: '3',
    name: 'Alexander Kiroi',
    email: 'email3@gmail.com',
    password: '1111',
    phone: '+380991234567',
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

export const servers: Server[] = [
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
