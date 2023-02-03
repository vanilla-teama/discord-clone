import mongoose from "mongoose";
const Schema = mongoose.Schema;

const personalMessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  channelId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  responsedMessageId: {
    type: Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  message: {
    type: String,
    required: true
  },
});

export default mongoose.model('PersonalMessage', personalMessageSchema);
