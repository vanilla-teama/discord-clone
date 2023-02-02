import mongoose from "mongoose";
const Schema = mongoose.Schema;

const serverSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

export default mongoose.model('Server', serverSchema);
