import mongoose from "mongoose";
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  banner: {
    type: String,
  },
  avatar: {
    type: String,
  },
  about: {
    type: String,
  },
});

export default mongoose.model('Profile', profileSchema);
