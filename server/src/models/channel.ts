import mongoose from "mongoose";
const Schema = mongoose.Schema;

const channelSchema = new Schema({
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
