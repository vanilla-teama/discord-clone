export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  phone: string;
}

class UserModel {
  async fetchUsers(): Promise<User[]> {
    const users: User[] = [
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

    return Promise.resolve(users);
  }
}

export default UserModel;
