import { Response, Request, NextFunction } from 'express'
import { RequestInterface } from '../interfaces/google.request.interface'
import { emailVerification, googleAuth, isUserValid, signIn, signUp } from '../services/auth/auth'



class AuthentificationController {
    async registration(req: Request, res: Response, next: NextFunction) {
        await signUp(req, res, next)
    }

    async login(req: any, res: Response, next: NextFunction) {
        await signIn(req, res, next)
    }

    async googleAuth(req: RequestInterface, res: Response, next: NextFunction) {                             
      await googleAuth(req, res, next)
    }

    async emailVerification(req: Request, res: Response, next: NextFunction) {
        await emailVerification(req, res, next)
    }

    async isUserValid(req: Request, res: Response, next: NextFunction) {
        await isUserValid(req, res, next)
    }

}

export const authController = new AuthentificationController()