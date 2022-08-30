import mongoose from 'mongoose'
import csv from 'mongoose-csv-export'
import { MeetupInterface } from '../../interfaces/meetupInterface'

const meetupSchema = new mongoose.Schema<MeetupInterface>({
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
}, {versionKey: false, timestamps: true})

meetupSchema.plugin(csv, {
    headers: 'Id Title Description Tags DueTime UserId',
    alias: {
        'Id': '_id',
        'Title' : 'title',
        'Description' : 'description',
        'Tags': 'tags',
        'DueTime': 'dueTime',
        'UserId': 'userId',
    },
})

export const meetup: mongoose.Model<MeetupInterface> = mongoose.model('meetups', meetupSchema)