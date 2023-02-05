import mongoose, { ValidateFn, Types } from 'mongoose';
const Schema = mongoose.Schema;

export interface UserSchema {
  name: string;
  password: string;
  email: string;
  phone: string;
  friends: Types.ObjectId[];
}

const userSchema = new Schema<UserSchema>({
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
  F extends keyof UserSchema,
  R = F extends 'name'
    ? UserSchema['name']
    : F extends 'password'
    ? UserSchema['password']
    : F extends 'email'
    ? UserSchema['email']
    : F extends 'phone'
    ? UserSchema['phone']
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
