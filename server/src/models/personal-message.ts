import mongoose from "mongoose";
const Schema = mongoose.Schema;

const personalMessageSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    required: true
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
