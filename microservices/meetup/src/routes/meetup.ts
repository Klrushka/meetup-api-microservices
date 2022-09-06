import { Router } from 'express'
import { meetupController } from '../controllers/meetup'
import { isUser } from '../middlewares/auth'
import { requestLoggerMiddleware } from '../middlewares/logger'
import { validator } from '../middlewares/validator'



export function initMeeetupRoutes(): Router {
    const router = Router()

    router.get('/meetups', requestLoggerMiddleware, isUser, meetupController.read)
    router.get('/meetups/:id', requestLoggerMiddleware, isUser, meetupController.readById)
    router.get('/meetupscsv', requestLoggerMiddleware, isUser, meetupController.readCsv)
    router.get('/meetupspdf', requestLoggerMiddleware, isUser, meetupController.readPdf)
    router.post('/meetups', requestLoggerMiddleware, isUser, validator.validateMeetup, meetupController.create)
    router.put('/meetups/:id', requestLoggerMiddleware, isUser, validator.validateMeetup, meetupController.update)
    router.delete('/meetups/:id', requestLoggerMiddleware, isUser, meetupController.remove)


    return router
}