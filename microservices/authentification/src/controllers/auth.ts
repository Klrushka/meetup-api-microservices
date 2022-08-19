import { Response, Request, NextFunction } from 'express'
import { user } from '../models/db/user'
import { encrypt } from '../services/encryption/password'
import passport from 'passport'
import { strategies } from '../enums/strategies'
import { UserInterface } from '../interfaces/user.interface'


class AuthentificationController {
    async registration(req: Request, res: Response) {

        Object.assign(req.body, encrypt(req.body.password))

        const newUser = await user.create(req.body)

        // TODO return jwt object
        res.json(newUser)
    }


    async login(req: Request, res: Response, next: NextFunction) {

        passport.authenticate(strategies.local, (err: Error, user: UserInterface) => {
            if (err) {
                res.status(404).json(err)
            }
            if (!user) {
                res.status(401).json({
                    message: 'Invalid password or email',
                })
            } else {
                res.status(200).json(user)
            }
        })(req, res, next)
    }

}

export const authController = new AuthentificationController()