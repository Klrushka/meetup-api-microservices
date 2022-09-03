import { NextFunction, Request, Response } from 'express'
import { meetup } from '../../model/db/meetup'


export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const esDeletedMeetup = await meetup.findOne({ _id: req.params.id })
        await esDeletedMeetup?.remove()
        const deletedMeetup = await meetup.deleteOne({ _id: req.params.id })
        res.status(204).json(deletedMeetup)
    } catch (err) {
        next(err)
    }
}