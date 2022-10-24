import 'dotenv/config';
import './config/passport';
import passport from 'passport';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import express, { Router } from 'express';
import { logger } from './services/logger';
import { dbLogger } from './middlewares/logger';

class App {
  public app: express.Application;
  public port: string | number;
  public enviroment: string;

  constructor(routes: Router[]) {
    this.app = express();
    this.port = process.env.PORT ?? 3000;
    this.enviroment = process.env.NODE_ENV ?? 'development';

    this.databaseConnection();
    this.initMiddleware();
    this.initRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`Server started on port ${this.port}`);
    });
  }

  private initRoutes(routes: Router[]) {
    routes.forEach(route => {
      this.app.use('/auth', route);
    });
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(passport.initialize());
    this.app.use(session({ secret: process.env.SECRET_KEY ?? '' }));
    this.app.use(passport.session());
    logger.info('Middlewares was initialized');
  }

  private async databaseConnection() {
    await mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    mongoose.set('debug', (collectionName, method) => {
      dbLogger(`${collectionName}.${method}`);
    });
  }
}

export default App;
