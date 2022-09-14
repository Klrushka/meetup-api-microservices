import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { meetupController } from '../controllers/meetup'
import { isUser } from '../middlewares/auth'
import { requestLoggerMiddleware } from '../middlewares/logger'
import { validator } from '../middlewares/validator'



export function initMeeetupRoutes(): Router {
    const router = Router()

    router.get('/meetups', requestLoggerMiddleware, isUser, expressAsyncHandler(meetupController.read))
    router.get('/meetups/:id', requestLoggerMiddleware, isUser, expressAsyncHandler(meetupController.readById))
    router.get('/meetupscsv', requestLoggerMiddleware, isUser, expressAsyncHandler(meetupController.readCsv))
    router.get('/meetupspdf', requestLoggerMiddleware, isUser, expressAsyncHandler(meetupController.readPdf))
    router.post('/meetups', requestLoggerMiddleware, isUser, validator.validateMeetup, expressAsyncHandler(meetupController.create))
    router.put('/meetups/:id', requestLoggerMiddleware, isUser, validator.validateMeetup, expressAsyncHandler(meetupController.update))
    router.delete('/meetups/:id', requestLoggerMiddleware, isUser, expressAsyncHandler(meetupController.remove))


    return router
}