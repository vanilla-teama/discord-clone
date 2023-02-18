import mongoose, { HydratedDocument, Types } from "mongoose";
import { FetchedUser } from "../utils/dto";
const Schema = mongoose.Schema;

export interface ServerDocument extends mongoose.Document {
  name: string;
  image: string | null;
  owner: Types.ObjectId;
}

const serverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    get(image: Buffer | null) {
      return image ? image.toString('base64') : null;
    }
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
  }
}, {
  toJSON: { getters: true },
  toObject: { getters: true },
});

export default mongoose.model('Server', serverSchema);
