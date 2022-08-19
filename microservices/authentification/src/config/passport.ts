import passport from 'passport'
import { localStrategy } from '../strategies/local'
import { googleStrategy } from '../strategies/google'
import { serialize, deserialize } from '../services/passport.serialization'

passport.use(localStrategy)
passport.use(googleStrategy)

passport.serializeUser(serialize)

passport.deserializeUser(deserialize)