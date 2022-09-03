import { Request, Response, NextFunction } from 'express'
import { meetup } from '../../model/db/meetup'

async function readById (req: Request, res: Response, next: NextFunction) {
    try {
        const findedMeetup = await meetup.findById({ _id: req.params.id })
        if (!findedMeetup) {
            res.status(404).json({
                message: 'Meetup doesn\'t exist'
            })
            return
        }

        res.status(200).json(findedMeetup)
    } catch (err) {
        next(err)
    }
}

async function read(req: Request, res: Response, next: NextFunction){
    try {
        if (req.query.search) {
            console.log(req.query.search)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const esSearchMeetup = await meetup.search({
                match: {
                  title: {
                    query: req.query.search,
                    fuzziness: 'auto'
                  }
                }
              }, { hydrate: true })
            res.status(200).json(esSearchMeetup.body.hits.hydrated)
            return
        }


        const meetups = await meetup.find()
        res.status(200).json(meetups)
    } catch (err) {
        next(err)
    }
}

export {
    readById,
    read,
}