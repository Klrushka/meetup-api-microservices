import { Router } from 'express'
import passport from 'passport'
import { authController } from '../controllers/auth'


export function initRoutes(): Router {
    const router = Router()
    router.post('/registration', authController.registration)
    router.post('/login', authController.login)
    router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
    router.get(
        '/',
        passport.authenticate('google', {
            successRedirect: '/success',
            failureRedirect: '/failure',
        }),
    )
    return router
}