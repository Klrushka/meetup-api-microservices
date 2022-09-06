import mongoose from 'mongoose'
import { pointInterface } from './pointInterface'

export interface MeetupInterface extends mongoose.Document{
    _id: {
        type: string,
    }
    title: {
        type: string,
    },
    description: {  
        type: string,
    },
    dueTime: {
        type: Date,
    },
    tags: {
        type: [string],
    },
    userId: {
        type: string,
        allowNull: false
    },
    location: pointInterface
    createdAt: {
        type: Date,
    },
    updatedAt: { 
        type: Date,
    },
}

