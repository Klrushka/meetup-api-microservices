import { Request, Response, NextFunction } from 'express'
import { app } from '../app'
import { RequestInterface } from '../interfaces/requetInterface'
import { client } from '../model/db/esclient'
import { meetup } from '../model/db/meetup'
import PDFDocument from 'pdfkit-table'

class MeetupController {
    async create(req: RequestInterface, res: Response, next: NextFunction) {
        const payload = { ...req.body, ...{ userId: req?.userId } }
        const newMeetup = await meetup.create(payload)
        await client.index({
            index: 'meetup',
            body: { ...newMeetup },
        })

        res.status(201).json(newMeetup)
    }

    async read(req: Request, res: Response, next: NextFunction) {
        if (req.query.search) {
            const esSearchMeetup = await client.search({
                index: 'meetup',
                q: req.query.search as string
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            app.io.emit('readalles', esSearchMeetup)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
    }

    async readById(req: Request, res: Response, next: NextFunction) {
        const findedMeetup = await meetup.findById({ _id: req.params.id })
        if (!findedMeetup) {
            res.status(404).json({
                message: 'Meetup doesn\'t exist'
            })
            return
        }

        res.status(200).json(findedMeetup)
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const updatedUser = await meetup.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })

        if (!updatedUser) {
            res.status(404).json({
                message: 'Meetup doesn\'t exist'
            })
            return
        }

        res.status(201).json(updatedUser)
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const deletedMeetup = await meetup.deleteOne({ _id: req.params.id })
        const index = await client.search({
            index: 'meetup',
            q: req.params.id as string
        })
        const {_index, _type, _id} = index.body.hits.hits[0]
        await client.delete({index: _index, type: _type, id: _id})
        res.status(204).json(deletedMeetup)
    }

    async readCsv(req: Request, res: Response, next: NextFunction) {
        const meetups = await meetup.find()
        res.header('Content-Type', 'text/csv; charset=utf-8')
        meetup.csvReadStream(meetups).pipe(res)
    }

    async readPdf(req: Request, res: Response, next: NextFunction) {
        const meetups = await meetup.find()

        const rows = meetups.map(item => {
            const data = []
            data.push(item.id, item.title, item.description, item.dueTime, item.userId)
            return data
        })

        const doc = new PDFDocument()
        const table = {
            headers: ['Id', 'Title', 'Description', 'DueTime', 'UserId'],
            rows,
        }

        await doc.table(table, {
            columnSpacing: 10
        })
        doc.pipe(res)
        doc.end()
    }
}


export const meetupController = new MeetupController()
