import { Schema, model } from 'mongoose';

const signSchema = new Schema({
  sign_name: {
    type: String,
    required: true
  },
  cloud_location: {
    type: String,
    required: true
  }
});

const Gif = model('Gif', signSchema);

export default Gif;
