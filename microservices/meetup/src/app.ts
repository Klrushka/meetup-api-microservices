import 'dotenv/config'
import express, { Router } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import {logger} from './services/logger'
import { dbLogger } from './middlewares/logger'


class App {
    public app: express.Application
    public port: string | number



    constructor(routes: Router[]) {
        this.app = express()
        this.port = process.env.PORT ?? 3001

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
        routes.forEach(route => { this.app.use('/', route) })
    }

    private initMiddleware() {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        logger.info('Middlewares was initialized')
    }


    private async databaseConnection() {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        mongoose.set('debug', (collectionName, method) => {
            dbLogger(`${collectionName}.${method}`)
        })
    }



}


export default App