import { Strategy } from 'passport-google-oauth2'
import {user} from '../models/db/user' 



export const googleStrategy = new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackURL: 'http://localhost:3000/auth',
    passReqToCallback: true
},
    function (request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
        /*user.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user)
        })*/

        console.log(profile)
        
    }
)