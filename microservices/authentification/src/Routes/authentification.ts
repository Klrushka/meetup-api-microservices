import { Router } from 'express'
import passport from 'passport'
import { authController } from '../controllers/auth'
import { requestLoggerMiddleware } from '../middlewares/logger'
import { validator } from '../middlewares/validator'
import { expressjwt } from 'express-jwt'
import { userController } from '../controllers/user'
// import multer from 'multer'


const jwt = expressjwt({
    secret: process.env.SECRET_KEY ?? '',
    algorithms: ['HS256'],
})

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
 
// const upload = multer({ storage: storage })



export function initRoutes(): Router {
    const router = Router()
    router.post('/registration', requestLoggerMiddleware, validator.validateRegistration, /*upload.single('avatar'),*/ authController.registration)
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
    router.put('/user', jwt, userController.update) 
    router.get('/verify-email/:token', authController.emailVerification)
    return router
}