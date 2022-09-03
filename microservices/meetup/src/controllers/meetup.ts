import { Request, Response, NextFunction } from 'express'
import { RequestInterface } from '../interfaces/requetInterface'
import { create } from '../services/crud/create'
import { remove } from '../services/crud/delete'
import { read, readById } from '../services/crud/read'
import { update } from '../services/crud/update'
import { createCsv } from '../services/reports.generators/csv.creator'
import { createPdf } from '../services/reports.generators/pdf.creator'

class MeetupController {
    async create(req: RequestInterface, res: Response, next: NextFunction) {
        await create(req, res, next)
    }
    async read(req: Request, res: Response, next: NextFunction) {
        await read(req, res, next)
    }

    async readById(req: Request, res: Response, next: NextFunction) {
        await readById(req, res, next)
    }

    async update(req: Request, res: Response, next: NextFunction) {
        await update(req, res, next)
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        await remove(req, res, next)
    }

    async readCsv(req: Request, res: Response, next: NextFunction) {
        await createCsv(req, res, next)
    }

    async readPdf(req: Request, res: Response, next: NextFunction) {
        await createPdf(req, res, next)
    }
}


export const meetupController = new MeetupController()
