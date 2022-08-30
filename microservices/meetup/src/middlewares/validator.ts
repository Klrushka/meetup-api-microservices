import { Request, Response, NextFunction } from 'express';
import { meetupValidator } from '../validators/meetup';

class Validator {
    validateMeetup(req: Request, res: Response, next: NextFunction) {
        const { error } = meetupValidator.validate(req.body)

        if (error) {
            next(error)
        }
        next()
    }
}


export const validator = new Validator()