import { Request, Response, NextFunction } from 'express'
import { meetup } from '../model/db/meetup'
import PDFDocument from 'pdfkit-table'

class MeetupController {
    async create(req: any, res: Response, next: NextFunction) {
        try {
            Object.assign(req.body, { userId: req?.userId })
            const newMeetup = await meetup.create(req.body)
            res.status(200).json(newMeetup)
        } catch (err) {
            next(err)
        }

    }
    async read(req: Request, res: Response, next: NextFunction) {
        try {
            const meetups = await meetup.find()
            res.status(200).json(meetups)
        } catch (err) {
            next(err)
        }
    }
    async readById(req: Request, res: Response, next: NextFunction) {
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
    async update(req: Request, res: Response, next: NextFunction) {
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

    async remove(req: Request, res: Response, next: NextFunction) {
        const deletedMeetup = await meetup.deleteOne({ _id: req.params.id })
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
