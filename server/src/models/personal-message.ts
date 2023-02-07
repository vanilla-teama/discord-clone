import mongoose, { HydratedDocument, Model, QueryWithHelpers, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface IPersonalMessage {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  responsedMessageId: Types.ObjectId;
  date: Date;
  message: string;
}

interface PersonalMessageQueryHelpers {
  byDeleted(
    deleted: boolean
  ): QueryWithHelpers<
    HydratedDocument<IPersonalMessage>[],
    HydratedDocument<IPersonalMessage>,
    PersonalMessageQueryHelpers
  >;
}

const Schema = mongoose.Schema;

export const personalMessageSchema = new Schema<
  IPersonalMessage,
  Model<IPersonalMessage, PersonalMessageQueryHelpers>,
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
    responsedMessageId: {
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
  },
  // {
  //   query: {
  //     byDeleted(deleted: boolean) {
  //       return this.find({ deleted });
  //     },
  //   },
  // }
);

personalMessageSchema.query.byDeleted = function byDeleted(
  this: QueryWithHelpers<any, HydratedDocument<IPersonalMessage>, PersonalMessageQueryHelpers>,
  deleted: boolean
) {
return this.find({ deleted });
};

personalMessageSchema.plugin(mongooseDelete);

export default mongoose.model('PersonalMessage', personalMessageSchema);
