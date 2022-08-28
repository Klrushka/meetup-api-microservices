import { Response, Request, NextFunction } from 'express'
import { user } from '../models/db/user'
import { encrypt } from '../services/encryption/password'
import passport from 'passport'
import { strategies } from '../enums/strategies'
import { UserInterface } from '../interfaces/user.interface'
import { generateJwt } from '../services/jwt'
import fs from 'fs'
import crypto from 'crypto'
import { sendMail } from '../services/mail.sendler'

const isUserExist = async (email: string) => {
    const isUser = await user.findOne({ email })

    return !!isUser
}



class AuthentificationController {
    async registration(req: Request, res: Response) {

        if (await isUserExist(req.body.email)) {
            res.status(409).json({ message: 'User already exist' })
            return
        }

        const emailToken = crypto.randomBytes(60).toString('hex')
        // const img = fs.readFileSync(req.file?.path ?? '')
        // const encodeImg = img.toString('base64')
        // const avatar = {
        //     contentType: req.file?.mimetype,
        //     avatar: Buffer.from(encodeImg, 'base64')
        // }


        Object.assign(req.body, { emailToken: emailToken })
        Object.assign(req.body, encrypt(req.body.password))
        // Object.assign(req.body, avatar)


        const newUser = await user.create(req.body)
        const msg = {
            from: process.env.MAIL_USER ?? 'unknown',
            to: newUser.email,
            subject: 'Veryfying',
            text: `http://${req.headers.host}/auth/verify-email/${newUser.emailToken}`,
            html: undefined
        }
        await sendMail(msg)





        // res.status(200).json(generateJwt(String(newUser._id), newUser.roles))
        res.status(200).json({ message: 'check your email and verify it' })
    }

    async login(req: any, res: Response, next: NextFunction) {
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
    }




    async googleAuth(req: any, res: any) {                                      //! TODO whats type?
        if (typeof req.user === 'undefined') { res.status(500).json() }
        else {
            res.json(
                generateJwt(req.user._id, req.user.roles),
            )
        }
    }


    async emailVerification(req: any, res: any, next: NextFunction) {

        const nonVerifyUser = await user.findOne({ emailToken: req.params.token })



        if (!nonVerifyUser) {
            res.status(404).json({
                message: 'User verified or doesn\'t exist'
            })
        } else {
            await user.updateOne({ _id: nonVerifyUser._id }, { $set: { emailToken: null, isVerified: true } })
            res.status(200).json({ message: 'User veryfied' })
        }


    }

}

export const authController = new AuthentificationController()