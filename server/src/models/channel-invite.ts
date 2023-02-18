import mongoose, { HydratedDocument, Model, QueryWithHelpers, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface ChannelInviteDocument {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
  messageId: Types.ObjectId;
  date: Date;
  message: string;
  status: ChannelInviteStatus;
}

export enum ChannelInviteStatus {
  Pending = 'pending',
  Accepted = 'accepted',
}

export const ChannelInviteStatusEnum: ChannelInviteStatus[] = [ChannelInviteStatus.Pending, ChannelInviteStatus.Accepted];

interface ChannelInviteQueryHelpers {
  byStatus(
    status: ChannelInviteStatus
  ): QueryWithHelpers<
    HydratedDocument<ChannelInviteDocument>[],
    HydratedDocument<ChannelInviteDocument>,
    ChannelInviteQueryHelpers
  >;
}

const Schema = mongoose.Schema;

export const channelInviteSchema = new Schema<
  ChannelInviteDocument,
  Model<ChannelInviteDocument, ChannelInviteQueryHelpers>,
  {},
  ChannelInviteQueryHelpers
>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  channelId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  messageId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  message: {
    type: String,
    required: true,
    default: '',
  },
  status: {
    type: String,
    enum: ChannelInviteStatusEnum,
    default: ChannelInviteStatus.Pending,
  }
});

channelInviteSchema.query.byStatus = function byStatus(
  this: QueryWithHelpers<any, HydratedDocument<ChannelInviteDocument>, ChannelInviteQueryHelpers>,
  status: ChannelInviteStatus
) {
  return this.find({ status });
};

channelInviteSchema.plugin(mongooseDelete);

export default mongoose.model('ChannelInvite', channelInviteSchema);
