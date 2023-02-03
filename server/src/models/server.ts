import mongoose from "mongoose";
const Schema = mongoose.Schema;

const serverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
}, {
  toJSON: { getters: true },
  toObject: { getters: true },
});

export default mongoose.model('Server', serverSchema);
