import bcrypt from 'bcrypt'
import { Strategy } from 'passport-local'
import { user } from '../models/db/user'
import { UserInterface } from '../interfaces/user.interface'

export const localStrategy = new Strategy(
    { usernameField: 'email' },
    function (username, password, done) {
        user.findOne({ email: username }, function (err: Error, user: UserInterface) {
            if (err) { return done(err) }
            if (!user) { return done(null, false) }
            if (!bcrypt.compareSync(password, user.hash)) { return done(null, false) }
            return done(null, user)
        })
    }
)