import { Response, Request, NextFunction } from 'express';
import { logger } from '../services/logger';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};

export const dbLogger = (msg: string) => {
    logger.debug(msg);
};

