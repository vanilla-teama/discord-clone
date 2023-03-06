import mongoose, { HydratedDocument, Model, QueryWithHelpers, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { personalMessageDTO } from '../utils/dto';
import { FetchedPersonalMessage } from '../utils/dto';

export interface PersonalMessageDocument {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  responsedToMessageId: Types.ObjectId;
  date: Date;
  message: string;
  responsedToMessage: PersonalMessageDocument | null;
}

interface PersonalMessageQueryHelpers {
  byDeleted(
    deleted: boolean
  ): QueryWithHelpers<
    HydratedDocument<PersonalMessageDocument>[],
    HydratedDocument<PersonalMessageDocument>,
    PersonalMessageQueryHelpers
  >;
}

const Schema = mongoose.Schema;

export const personalMessageSchema = new Schema<
  PersonalMessageDocument,
  Model<PersonalMessageDocument, PersonalMessageQueryHelpers>,
  {},
  PersonalMessageQueryHelpers
>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    responsedToMessageId: {
      type: Schema.Types.ObjectId,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    message: {
      type: String,
      required: true,
    },
    responsedToMessage: {
      type: Types.ObjectId,
      ref: 'PersonalMessage',
      // get: function(this: PersonalMessageDocument | null) {
      //   console.log(this);
      //   return this ? this : undefined;
      // } 
    },
  },
);

personalMessageSchema.query.byDeleted = function byDeleted(
  this: QueryWithHelpers<any, HydratedDocument<PersonalMessageDocument>, PersonalMessageQueryHelpers>,
  deleted: boolean
) {
return this.find({ deleted });
};

personalMessageSchema.plugin(mongooseDelete);

export default mongoose.model('PersonalMessage', personalMessageSchema);
