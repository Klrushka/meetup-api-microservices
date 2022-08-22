import { Response, Request, NextFunction } from 'express'
import { loginValidator, registrationValidator } from '../services/validators/shemas/request.validators'



class Validator {
    validateLogin(req: Request, res: Response, next: NextFunction) {
        const { error } = loginValidator.validate(req.body)

        if (error) {
            next(error)
        }

        next()
    }

    validateRegistration(req: Request, res: Response, next: NextFunction) {
        const { error } = registrationValidator.validate(req.body)

        if (error) {
            next(error)
        }

        next()
    }
}


export const validator = new Validator()