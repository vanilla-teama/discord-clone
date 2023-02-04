import mongoose, { Types } from "mongoose";
import mongooseDelete from 'mongoose-delete';

// export interface PersonalMessage {
//   fromUserId: Types.ObjectId,
//   toUserId: Types.ObjectId,
//   responsedMessageId: Types.ObjectId,
//   date: typeof Date
// }

const Schema = mongoose.Schema;

export const personalMessageSchema = new Schema({
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
}, {
  query: {
    byDeleted(deleted: boolean) {
      return this.find({ deleted });
    }
  }
});

personalMessageSchema.plugin(mongooseDelete);

export default mongoose.model('PersonalMessage', personalMessageSchema);
