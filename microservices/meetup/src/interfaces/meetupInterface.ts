import mongoose from 'mongoose';
import { pointInterface } from './pointInterface';

export interface MeetupInterface extends mongoose.Document {
  _id: {
    type: string;
  };
  title: string;
  description: string;
  dueTime: Date;
  tags: string[];
  userId: {
    type: string;
    allowNull: false;
  };
  location: pointInterface;
  createdAt: Date;
  updatedAt: Date;
}
