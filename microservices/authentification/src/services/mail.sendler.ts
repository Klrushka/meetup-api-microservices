import nodemailer from 'nodemailer'
import { logger } from './logger'


export async function sendMail(msg: {from: string, to: string, subject: string | undefined, text: string | undefined, html: string | undefined}) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD 
        },
    })

    const info = await transporter.sendMail(msg)

    logger.debug(`Message sent: ${info.messageId}`)
}