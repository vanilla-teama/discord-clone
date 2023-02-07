import mongoose, { ValidateFn, Types } from 'mongoose';
const Schema = mongoose.Schema;

export interface IUser {
  name: string;
  password: string;
  email: string;
  phone: string;
  friends: Types.ObjectId[];
}

export interface IChat {
  userId: Types.ObjectId;
  username: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const validateUserField = <
  F extends keyof IUser,
  R = F extends 'name'
    ? IUser['name']
    : F extends 'password'
    ? IUser['password']
    : F extends 'email'
    ? IUser['email']
    : F extends 'phone'
    ? IUser['phone']
    : F extends 'friends'
    ? string[]
    : never
>(
  value: unknown,
  field: F
): value is R => {
  return true;
};

export default mongoose.model('User', userSchema);
