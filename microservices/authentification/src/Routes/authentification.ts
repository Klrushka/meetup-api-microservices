import { RequestHandler, Router } from 'express'
import passport from 'passport'
import { authController } from '../controllers/auth'
import { requestLoggerMiddleware } from '../middlewares/logger'
import { userController } from '../controllers/user'
import { jwt } from '../middlewares/jwt'
import { strategies } from '../enums/strategies'
import validator from '../middlewares/validator'



export function initRoutes(): Router {
    const router = Router()
    router.post('/registration', requestLoggerMiddleware, validator.validateRegistration , authController.registration)
    router.post('/login', requestLoggerMiddleware, validator.validateLogin, authController.login)
    router.get('/google', requestLoggerMiddleware, passport.authenticate(strategies.google, { scope: ['email', 'profile'] }))
    router.get(
        '/',
        requestLoggerMiddleware,
        passport.authenticate(strategies.google, {
            successRedirect: '/auth/success',
            failureRedirect: '/auth/failure',
        }),
        router.get(
            '/success',
            requestLoggerMiddleware,
            authController.googleAuth as RequestHandler
        )
    )
    router.put('/user', requestLoggerMiddleware, jwt, userController.update)
    router.get('/verify-email/:token', requestLoggerMiddleware, authController.emailVerification)
    router.post ('/verify-user', requestLoggerMiddleware, authController.isUserValid)
    return router
}