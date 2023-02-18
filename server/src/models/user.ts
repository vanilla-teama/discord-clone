import bcrypt from 'bcrypt-nodejs';
import mongoose, { Types } from 'mongoose';
import { FetchedUser, chatDTO } from '../utils/dto';

const Schema = mongoose.Schema;

export interface UserDocument extends mongoose.Document {
  name: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  email: string;
  phone: string;
  friends: Types.ObjectId[];
  invitesFrom: Types.ObjectId[];
  invitesTo: Types.ObjectId[];
  invitesToChannels: Types.ObjectId[];
  joinedChannels: Types.ObjectId[];
  chats: UserDocument[];
  availability: Availability;
  profile: {
    avatar: Buffer;
    banner: string;
    about: string;
  };
  comparePassword: comparePasswordFunction;
  tokens: AuthToken[];
  createdAt: Date;
}

export interface AuthToken {
  accessToken: string;
  kind: string;
}

type comparePasswordFunction = (candidatePassword: string, cb: (err: unknown, isMatch: boolean) => void) => void;

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

const UserSchema = new Schema<UserDocument>(
  {
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
    friends: [{ type: Types.ObjectId, ref: 'User' }],
    invitesFrom: [{ type: Types.ObjectId, ref: 'User' }],
    invitesTo: [{ type: Types.ObjectId, ref: 'User' }],
    invitesToChannels: [{ type: Types.ObjectId, ref: 'Channel' }],
    joinedChannels: [{ type: Types.ObjectId, ref: 'Channel' }],
    chats: [{ 
      type: Types.ObjectId, 
      ref: 'User', 
      get: function(this: FetchedUser) {
        return chatDTO(this);
      } 
    }],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (
  this: (typeof UserSchema)['methods'],
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

UserSchema.methods.comparePassword = comparePassword;

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

const User = mongoose.model('User', UserSchema);

User.watch().
  on('change', data => console.log(data));

export default User;
