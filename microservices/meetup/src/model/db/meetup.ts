import mongoose from 'mongoose'


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

export const meetup: mongoose.Model<MeetupInterface> = mongoose.model('meetups', meetupSchema)