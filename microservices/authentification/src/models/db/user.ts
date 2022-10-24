import mongoose from 'mongoose';
import { UserInterface } from '../../interfaces/user.interface';

const userShema = new mongoose.Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
    hash: {
      type: String,
    },
    salt: {
      type: String,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    avatar: {
      type: Buffer, // TODO спросить про буфер
      contentType: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailToken: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export const user: mongoose.Model<UserInterface> = mongoose.model(
  'users',
  userShema
);
