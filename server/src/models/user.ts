import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
});

userSchema.virtual('chats', {
  ref: 'PersonalMessage'
})

export default mongoose.model('User', userSchema);
