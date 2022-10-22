import { Document } from 'mongoose';

export interface UserInterface extends Document {
    _id: string,
    name: string,
    surname: string,
    email: string,
    telephone: string,
    hash: string,
    salt: string,
    createdAt: Date,
    updatedAt: Date,
    roles: Array<string>,
    avatar: Buffer,
    isVerified: boolean,
    emailToken: 'string'
}