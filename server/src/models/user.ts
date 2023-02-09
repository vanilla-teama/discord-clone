import mongoose, { ValidateFn, Types, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';

const Schema = mongoose.Schema;

export interface UserDocument extends mongoose.Document {
  name: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  email: string;
  phone: string;
  friends: Types.ObjectId[];
  availability: Availability;
  profile: {
    avatar: Buffer;
    banner: string;
    about: string;
  };
  comparePassword: comparePasswordFunction;
  tokens: AuthToken[];
}

export interface AuthToken {
  accessToken: string;
  kind: string;
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: unknown, isMatch: boolean) => void) => void;

export interface IChat {
  userId: Types.ObjectId;
  username: string;
  availability: Availability;
}

export enum Availability {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
  DoNotDisturb = 'donotdisturb',
}

const availabilityEnum: Availability[] = [
  Availability.Online,
  Availability.Offline,
  Availability.Away,
  Availability.DoNotDisturb,
];

const userSchema = new Schema<UserDocument>({
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
  availability: {
    type: String,
    enum: availabilityEnum,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  tokens: Array,
  profile: {
    avatar: Buffer,
    banner: String,
    about: String,
  },
}, { timestamps: true });

userSchema.pre("save", function save(next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, null, (err: mongoose.Error, hash) => {
          if (err) { return next(err); }
          user.password = hash;
          next();
      });
  });
});

const comparePassword: comparePasswordFunction = function (this: typeof userSchema['methods'], candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
  });
};

userSchema.methods.comparePassword = comparePassword;

export const validateUserField = <
  F extends keyof UserDocument,
  R = F extends 'name'
    ? UserDocument['name']
    : F extends 'password'
    ? UserDocument['password']
    : F extends 'email'
    ? UserDocument['email']
    : F extends 'phone'
    ? UserDocument['phone']
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
