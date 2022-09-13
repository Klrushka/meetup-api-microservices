import mongoose from 'mongoose'
import csv from 'mongoose-csv-export'
import { MeetupInterface } from '../../interfaces/meetupInterface'
import 'mongoosastic-ts/dist/mongoosastic'
import { pointSchema } from './point'


const meetupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        allowNull: false,
    },
    description: {
        type: String,
    },
    tags: {
        type: [String],
    },
    userId: {
        type: String,
        required: true,
    },
    dueTime: {
        type: Date,
    },
    location: {
        type: pointSchema,
        index: '2dsphere'
    }
}, { versionKey: false, timestamps: true })


meetupSchema.plugin(csv, {
    headers: 'Id Title Description Tags DueTime UserId',
    alias: {
        'Id': '_id',
        'Title': 'title',
        'Description': 'description',
        'Tags': 'tags',
        'DueTime': 'dueTime',
        'UserId': 'userId',
    },
})

export const meetup = mongoose.model<MeetupInterface>('meetups', meetupSchema)