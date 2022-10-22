import { createLogger, format, transports } from 'winston';


const logFormat = format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
);

const logTransport = [
    new transports.Console(),
    new transports.File({
        filename: process.env.LOG_FILE_PATH,
    })

];

export const logger = createLogger({ 
    level: process.env.LOG_LEVEL, format: logFormat, transports: logTransport,
});