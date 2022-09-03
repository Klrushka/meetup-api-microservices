import { Request, Response, NextFunction } from 'express'
import { meetup } from '../../model/db/meetup'

export async function createCsv(req: Request, res: Response, next: NextFunction) {
    try {
        const meetups = await meetup.find()
        res.header('Content-Type', 'text/csv; charset=utf-8')
        meetup.csvReadStream(meetups).pipe(res)
    } catch (err) {
        next(err)
    }
}