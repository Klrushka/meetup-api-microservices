import crypto from 'crypto'
import passport from 'passport'
import { Response, Request, NextFunction } from 'express'
import { user } from '../../models/db/user'
import { encrypt } from '../encryption/password'
import { sendMail } from '../mail.sendler'
import { strategies } from '../../enums/strategies'
import { UserInterface } from '../../interfaces/user.interface'
import { generateJwt } from '../jwt'
import { RequestInterface } from '../../interfaces/google.request.interface'
import jwtDecode from 'jwt-decode'
import { googleUser } from '../../models/db/google.user'

const isUserExist = async (email: string) => {
    const isUser = await user.findOne({ email })

    return !!isUser
}

async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        if (await isUserExist(req.body.email)) {
            res.status(409).json({ message: 'User already exist' })
            return
        }

        const emailToken = crypto.randomBytes(60).toString('hex')


        Object.assign(req.body, { emailToken: emailToken })
        Object.assign(req.body, encrypt(req.body.password))


        const newUser = await user.create(req.body)
        const msg = {
            from: process.env.MAIL_USER ?? 'unknown',
            to: newUser.email,
            subject: 'Veryfying',
            text: `http://${req.headers.host}/auth/verify-email/${newUser.emailToken}`,
            html: undefined
        }
        await sendMail(msg)
        res.status(200).json({ message: 'check your email and verify it' })
    } catch (err) {
        next(err)
    }
}

async function signIn(req: Request, res: Response, next: NextFunction) {
    try {
        passport.authenticate(strategies.local, (err: Error, user: UserInterface) => {

            if (err) {
                res.status(404).json(err)
            }
            if (!user) {
                res.status(401).json({
                    message: 'Invalid password or email',
                })
            } else if (!user.isVerified) {
                res.status(403).json({
                    message: 'Please check your email to confirm it'
                })
            }
            else {
                res.status(200).json(generateJwt(user._id, user.roles))
            }
        })(req, res, next)
    } catch (err) {
        next(err)
    }
}


async function googleAuth(req: RequestInterface, res: Response, next: NextFunction) {
    try {
        if (typeof req.user === 'undefined') { res.status(500).json() }
        else {
            res.json(
                generateJwt(req.user._id, req.user.roles),
            )
        }
    } catch (err) {
        next(err)
    }
}

async function emailVerification(req: Request, res: Response, next: NextFunction) {
    try {
        const nonVerifyUser = await user.findOne({ emailToken: req.params.token })

        if (!nonVerifyUser) {
            res.status(404).json({
                message: 'User verified or doesn\'t exist'
            })
        } else {
            await user.updateOne({ _id: nonVerifyUser._id }, { $set: { emailToken: null, isVerified: true } })
            res.status(200).json({ message: 'User veryfied' })
        }
    } catch (err) {
        next(err)
    }
}

async function isUserValid(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body.token) {
            return res.status(500).json({
                message: 'invalid Token',
                isValid: false,
            })
        }

        const userData: any = jwtDecode(req.body.token)


        let isUser = await user.findOne({ _id: userData.id })

        if (!isUser) {
            isUser = await googleUser.findOne({ _id: userData.id })
        }

        res.status(200).json({
            isValid: !!isUser,
            id: userData.id
        })
    } catch (err) {
        next(err)
    }

}

export {
    isUserValid,
    emailVerification,
    googleAuth,
    signIn,
    signUp,
}
