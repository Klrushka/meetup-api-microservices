import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { googleUser } from '../models/db/google.user'



export const googleStrategy = new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true
},
    async function (_request: any, _accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback) {

        try {
            let user = await googleUser.findOne({ id: profile.id })
            if (!user) {
                user = await googleUser.create(profile)
            }
            done(null, user)
        }
        catch (err) {
            done(err)
        }
    }
)