import 'dotenv/config';
import express, { Router } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { logger } from './services/logger';
import { dbLogger } from './middlewares/logger';
import { Server, Socket } from 'socket.io';
import { initMeeetupRoutes } from './routes/meetup';

class App {
  public app: express.Application;
  public port: number;
  public server: http.Server;
  public io: Server;
  public enviroment: string;

  constructor(routes: Router[]) {
    this.app = express();
    this.port = +(process.env.PORT ?? 3001);
    this.enviroment = process.env.NODE_ENV ?? 'development';

    this.databaseConnection();
    this.initMiddleware();
    this.initRoutes(routes);

    this.server = http.createServer(this.app);
    this.io = new Server(this.server);
  }

  public listen() {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Client connected ${socket.id}`);
    });
    this.server.listen(this.port, () => {
      logger.info(`Server started on port ${this.port}`);
    });
  }

  public async stop() {
    await mongoose.connection.close();
    this.server.close(() => {
      logger.info(`Server stoped on port ${this.port}`);
    });
  }

  private initRoutes(routes: Router[]) {
    routes.forEach(route => {
      this.app.use('/', route);
    });
  }

  private initMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    logger.info('Middlewares was initialized');
  }

  private async databaseConnection() {
    const url = this.enviroment === 'test' 
    ? `mongodb://${process.env.DB_HOST_TEST}:${process.env.DB_PORT_TEST}/${process.env.DB_NAME_TEST}`
    : `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(url);
    mongoose.set('debug', (collectionName, method) => {
      dbLogger(`${collectionName}.${method}`);
    });
  }
}

const app = new App([initMeeetupRoutes()]);

export { app, App };
