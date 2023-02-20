import { Availability, Channel, Chat, PersonalMessage, Server, User } from '../types/entities';
import moment from '../lib/moment';
import { RenderedPersonalMessage } from '../views/chats-main-content-view';

export const users: User[] = [
  {
    id: '63eec17d4064de726f4584da',
    name: 'Hlib Hodovaniuk',
    password: '1111333',
    email: 'gleb.godovanyuk@gmail.com',
    phone: '+380991234567',
    availability: Availability.Offline,
    chats: [],
    friends: [],
    invitesTo: [],
    invitesFrom: [],
    invitesToChannels: [],
    createdAt: '',
    profile: {
      about: null,
      avatar: null,
      banner: null,
    },
  },
  {
    id: '63dd3dd9938e35dad6409e12',
    name: 'Alexander Chornyi',
    password: '1111',
    email: 'email2@gmail.com',
    phone: '+380992234567',
    availability: Availability.DoNotDisturb,
    chats: [],
    friends: [],
    invitesTo: [],
    invitesFrom: [],
    invitesToChannels: [],
    createdAt: '',
    profile: {
      about: null,
      avatar: null,
      banner: null,
    },
  },
  {
    id: '63dd3de6938e35dad6409e14',
    name: 'Alexander Kiroi',
    password: '1111',
    email: 'email3@gmail.com',
    phone: '+380993234567',
    availability: Availability.Online,
    chats: [],
    friends: [],
    invitesTo: [],
    invitesFrom: [],
    invitesToChannels: [],
    createdAt: '',
    profile: {
      about: null,
      avatar: null,
      banner: null,
    },
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
    invitesToChannels: [],
    createdAt: '',
    profile: {
      about: null,
      avatar: null,
      banner: null,
    },
  },
];

export const personalMessages: RenderedPersonalMessage[] = [
  {
    id: '63e6b8468f0b1be81c3b9a8b',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-10T21:33:35.565Z',
    message: 'AAAAAAAAAAAAAAAAA',
    responsedToMessage: null,
  },
  {
    id: '63e749ff1bd1a44611b774f5',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-11T07:55:02.898Z',
    message: 'asdasdasda',
    responsedToMessage: null,
  },
  {
    id: '63e74b0c6dad7043f836dd1f',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-11T07:56:17.808Z',
    message: 'asdsad',
    responsedToMessage: null,
  },
  {
    id: '63e78d07a0ad03395c854347',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-11T11:22:44.459Z',
    message: 'aaaa',
    responsedToMessage: null,
  },
  {
    id: '63e7ba03efdd54352ca369d1',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-11T15:31:44.311Z',
    message: 'OOOOOOOOOOOOOO',
    responsedToMessage: null,
  },
  {
    id: '63e7ba1defdd54352ca369df',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-11T15:31:44.311Z',
    message: 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
    responsedToMessage: null,
  },
  {
    id: '63eb46ed88a35fa989225249',
    userId: '63dd3d9da1340145e9b74055',
    username: 'H.HODOVANIUK',
    date: '2023-02-14T08:30:49.596Z',
    message: 'REPLIED TO ',
    responsedToMessage: {
      id: '63e7ba1defdd54352ca369df',
      userId: '63dd3de6938e35dad6409e14',
      username: 'A.KIROI',
      date: '2023-02-11T15:31:44.311Z',
      message: 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
      responsedToMessage: null,
    },
  },
  {
    id: '63eb498b88a35fa98922526c',
    userId: '63dd3d9da1340145e9b74055',
    username: 'H.HODOVANIUK',
    date: '2023-02-14T08:30:49.596Z',
    message: 'AAAAAAAAAAAAAAAAAA',
    responsedToMessage: {
      id: '63e7ba1defdd54352ca369df',
      userId: '63dd3de6938e35dad6409e14',
      username: 'A.KIROI',
      date: '2023-02-11T15:31:44.311Z',
      message: 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
      responsedToMessage: null,
    },
  },
  {
    id: '63eb575479584386fcb76604',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-14T09:38:50.238Z',
    message: 'asdasdsadsad',
    responsedToMessage: null,
  },
  {
    id: '63eb575479584386fcb7660d',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-14T09:38:50.238Z',
    message: 'asdasdsad',
    responsedToMessage: null,
  },
  {
    id: '63eb575579584386fcb76616',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-14T09:38:50.238Z',
    message: 'asdasdsadsad',
    responsedToMessage: null,
  },
  {
    id: '63eb575679584386fcb7661f',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-14T09:38:50.238Z',
    message: 'asdasdsadadsadasd',
    responsedToMessage: null,
  },
  {
    id: '63eb575779584386fcb76628',
    userId: '63dd3de6938e35dad6409e14',
    username: 'A.KIROI',
    date: '2023-02-14T09:38:50.238Z',
    message: 'JAJAJAJAJAJJA',
    responsedToMessage: null,
  },
];

export const servers: Server[] = [
  {
    id: '1',
    name: 'Fake RS School',
    image: '',
    owner: { name: 'ME', id: '123' },
  },
  {
    id: '2',
    name: 'Fake Twin Fin',
    image: ' Buffer.from',
    owner: { name: 'ME2', id: '123' },
  },
  {
    id: '3',
    name: 'Fake Vanilla Team',
    image: 'Buffer.from',
    owner: { name: 'ME3', id: '123' },
  },
];

export const channels: Channel[] = [
  {
    id: '1',
    name: 'Fake Test',
    serverId: '1',
  },
];

export const chats: Chat[] = [
  {
    id: '63dd3dd9938e35dad6409e12',
    userId: '63dd3d9da1340145e9b74055',
    userName: 'Hlib Hodovaniuk',
    availability: Availability.Away,
    createdAt: '',
  },
  {
    id: '63dd3d9da1340145e9b74055',
    userId: '63dd3dd9938e35dad6409e12',
    userName: 'Alexander Chornyi',
    availability: Availability.Away,
    createdAt: '',
  },
  {
    id: '63dd3de6938e35dad6409e14',
    userId: '63dd3de6938e35dad6409e14',
    userName: 'Alexander Kiroi',
    availability: Availability.Away,
    createdAt: '',
  },
];
