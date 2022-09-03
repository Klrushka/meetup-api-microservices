import { Router } from 'express'
import passport from 'passport'
import { authController } from '../controllers/auth'
import { requestLoggerMiddleware } from '../middlewares/logger'
import { validator } from '../middlewares/validator'
import { userController } from '../controllers/user'
import { jwt } from '../middlewares/jwt'



export function initRoutes(): Router {
    const router = Router()
    router.post('/registration', requestLoggerMiddleware, validator.validateRegistration, authController.registration)
    router.post('/login', requestLoggerMiddleware, validator.validateLogin, authController.login)
    router.get('/google', requestLoggerMiddleware, passport.authenticate('google', { scope: ['email', 'profile'] }))
    router.get(
        '/',
        requestLoggerMiddleware,
        passport.authenticate('google', {
            successRedirect: '/auth/success',
            failureRedirect: '/auth/failure',
        }),
        router.get(
            '/success',
            requestLoggerMiddleware,
            authController.googleAuth
        )
    )
    router.put('/user', requestLoggerMiddleware, jwt, userController.update)
    router.get('/verify-email/:token', requestLoggerMiddleware, authController.emailVerification)
    router.post ('/isUserValid', requestLoggerMiddleware, authController.isUserValid)
    return router
}