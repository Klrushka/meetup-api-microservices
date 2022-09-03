import { NextFunction, Request, Response } from 'express'
import { meetup } from '../../model/db/meetup'


export async function update(req: Request, res: Response, next: NextFunction){
    try {

        const updatedUser = await meetup.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })

        if (!updatedUser) {
            res.status(404).json({
                message: 'Meetup doesn\'t exist'
            })
            return
        }

        res.status(201).json(updatedUser)
    } catch (err) {
        next(err)
    }
}