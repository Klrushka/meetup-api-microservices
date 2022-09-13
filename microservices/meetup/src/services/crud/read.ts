import { Request, Response, NextFunction } from 'express'
import { app } from '../../app'
import { client } from '../../model/db/esclient'
import { meetup } from '../../model/db/meetup'


async function readById(req: Request, res: Response, next: NextFunction) {
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

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.query.search) {
            const esSearchMeetup = await client.search({
                index: 'meetup', 
                q: req.query.search as string
            })
            app.io.emit('readalles', esSearchMeetup)
            res.status(200).json(esSearchMeetup)
            return
        }

        if (req.query.near) {
            if (!Array.isArray(req.query.near)) {
                res.status(400).json({
                    message: 'Invalid coordinates'
                })
                return
            }
            const dist = +(req.query.dist ?? 100000)
            const point = req.query.near
            const near = await meetup.find({
                location: {
                    '$near': {
                        '$maxDistance': dist,
                        '$geometry': {
                            type: 'Point', coordinates: point
                        }
                    }
                }
            })
            app.io.emit('readallnear', near)
            res.status(200).json(near)
            return
        }


        const meetups = await meetup.find()
        app.io.emit('readall', meetups)
        res.status(200).json(meetups)
    } catch (err) {
        next(err)
    }
}

export {
    readById,
    read,
}