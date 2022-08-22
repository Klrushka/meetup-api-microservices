import 'dotenv/config'
import express, { Router } from 'express'
import mongoose from 'mongoose'
import { logger } from './services/logger'
import './config/passport'
import passport from 'passport'
import session from 'express-session'
import {dbLogger} from './middlewares/logger'

class App {
    public app: express.Application
    public port: string | number


    constructor(routes: Router[]) {
        this.app = express()
        this.port = process.env.PORT ?? 3000

        this.databaseConnection()
        this.initMiddleware()
        this.initRoutes(routes)
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`Server started on port ${this.port}`)
        })
    }

    private initRoutes(routes: Router[]) {
        routes.forEach(route => { this.app.use('/auth', route) })
    }

    private initMiddleware() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(passport.initialize())
        this.app.use(session({ secret: process.env.SECRET_KEY ?? '' }))
        this.app.use(passport.session())
        logger.info('Middlewares was initialized')
    }
   

    private async databaseConnection(){
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        mongoose.set('debug', (collectionName, method, query) => {
            dbLogger(`${collectionName}.${method}, ${JSON.stringify(query)}`)
        })
    }
}


export default App