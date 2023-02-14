import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

export interface ChannelDocument extends mongoose.Document {
  serverId: Types.ObjectId;
  name: string;
}

const channelSchema = new Schema<ChannelDocument>({
  serverId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
});

export default mongoose.model('Channel', channelSchema);
