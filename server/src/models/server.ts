import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

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
}, {
  toJSON: { getters: true },
  toObject: { getters: true },
});

export default mongoose.model('Server', serverSchema);
