import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        givenName: {
            type: String
        },
        familyName: {
            type: String
        }
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String,
    },
    locale: {
        type: String,
    },
    roles: {
        type: Array,
        default: ['user']
    }
}, { timestamps: true, versionKey: false });


export const googleUser = mongoose.model('google-users', googleUserSchema);