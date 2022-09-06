import { Response, NextFunction } from 'express'
import { RequestInterface } from '../../interfaces/requetInterface'
import { meetup } from '../../model/db/meetup'

export async function create(req: RequestInterface, res: Response, next: NextFunction){
    try {
        Object.assign(req.body, { userId: req?.userId })
        const newMeetup = await meetup.create(req.body)
        res.status(200).json(newMeetup)
    } catch (err) {
        next(err)   
    }

}