import { Response, Request, NextFunction } from 'express'
import { user } from '../models/db/user'
import { encrypt } from '../services/encryption/password'
import passport from 'passport'
import { strategies } from '../enums/strategies'
import { UserInterface } from '../interfaces/user.interface'
import { generateJwt } from '../services/jwt'
import fs from 'fs'

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



        const img = fs.readFileSync(req.file?.path ?? '')
        const encode_img = img.toString('base64')
        const avatar = {
            contentType: req.file?.mimetype,
            avatar: new Buffer(encode_img, 'base64')
        }


        console.log(req.file)
        console.log(req.body)


        Object.assign(req.body, encrypt(req.body.password))
        Object.assign(req.body, avatar)

        console.log(req.body)


        const newUser = await user.create(req.body)

        res.status(200).json(generateJwt(String(newUser._id), newUser.roles))
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
            } else {
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

}

export const authController = new AuthentificationController()