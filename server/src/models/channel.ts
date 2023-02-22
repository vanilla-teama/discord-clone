import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

export interface ChannelDocument extends mongoose.Document {
  serverId: Types.ObjectId;
  name: string;
  general: boolean;
}

const channelSchema = new Schema<ChannelDocument>({
  serverId: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  general: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Channel', channelSchema);
