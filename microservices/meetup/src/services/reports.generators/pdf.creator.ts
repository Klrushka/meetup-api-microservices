import { Request, Response, NextFunction } from 'express'
import { meetup } from '../../model/db/meetup'
import PDFDocument from 'pdfkit-table'


export async function createPdf(req: Request, res: Response, next: NextFunction) {
    try {
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
    } catch (err) {
        next(err)
    }
}