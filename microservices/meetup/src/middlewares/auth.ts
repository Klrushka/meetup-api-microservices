import { Request, Response, NextFunction } from 'express'
import request from 'request'

export const isUser = function (req: Request, res: Response, next: NextFunction) {
    const host = process.env.USER_CHECK_HOST
    const port = process.env.USER_CHECK_PORT

    request.post({
        uri: `http://${host}:${port}/auth/isUserValid`,
        form: {
            token: req.headers.authorization
        }
    }, (err, response, body) => {
        if (err) {
            next(err)
        }

        const validationInfo = JSON.parse(body)
        Object.defineProperty(req, 'userId', { value: validationInfo.id })
        if (!validationInfo.isValid) {
            return res.status(403).json({
                message: 'Forbbiden'
            })
        }

        next()
    })
}