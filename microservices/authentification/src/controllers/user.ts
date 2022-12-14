import { Response, Request, NextFunction } from 'express'
import { user } from '../models/db/user'

class UserController {
    async update(req: any, res: Response, next: NextFunction) {
            const updatedUser = await user.findByIdAndUpdate({ _id: req.auth.id }, { $set: req.body }, { new: true })
            res.status(200).json(updatedUser)
    }
}

export const userController = new UserController() 