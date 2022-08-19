import mongoose from 'mongoose'

const userShema = new mongoose.Schema({
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
        type: Array,
        default: ['user'] 
    }
   

}, {timestamps: true, versionKey: false})


export const user = mongoose.model('users', userShema)