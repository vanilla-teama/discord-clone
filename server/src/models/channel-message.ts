import mongoose, { HydratedDocument, Model, QueryWithHelpers, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface ChannelMessageDocument {
  service: boolean;
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
  responsedToMessageId: Types.ObjectId;
  date: Date;
  message: string;
  responsedToMessage: ChannelMessageDocument | null;
}

interface ChannelMessageQueryHelpers {
  byDeleted(
    deleted: boolean
  ): QueryWithHelpers<
    HydratedDocument<ChannelMessageDocument>[],
    HydratedDocument<ChannelMessageDocument>,
    ChannelMessageQueryHelpers
  >;
}

const Schema = mongoose.Schema;

export const channelMessageSchema = new Schema<
  ChannelMessageDocument,
  Model<ChannelMessageDocument, ChannelMessageQueryHelpers>,
  {},
  ChannelMessageQueryHelpers
>(
  {
    service: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    channelId: {
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
      ref: 'ChannelMessage',
    },
  },
);

channelMessageSchema.query.byDeleted = function byDeleted(
  this: QueryWithHelpers<any, HydratedDocument<ChannelMessageDocument>, ChannelMessageQueryHelpers>,
  deleted: boolean
) {
return this.find({ deleted });
};

channelMessageSchema.plugin(mongooseDelete);

export default mongoose.model('ChannelMessage', channelMessageSchema);
