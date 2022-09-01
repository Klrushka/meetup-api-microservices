import mongoose from 'mongoose'
import csv from 'mongoose-csv-export'
import { MeetupInterface } from '../../interfaces/meetupInterface'
import 'mongoosastic-ts/dist/mongoosastic'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mongoosastic from 'mongoosastic'


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
}, { versionKey: false, timestamps: true })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
meetupSchema.plugin(mongoosastic,  {
    'host': 'localhost',
    'port': 9200
})

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