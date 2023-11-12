import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike(process.env.NODE_ENV.toUpperCase(), {
        colors: true,
        prettyPrint: true,
    }),
);

const dailyOption = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(process.env.NODE_ENV.toUpperCase(), {
                colors: false,
                prettyPrint: true,
            }),
        ),
    };
};

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format,
        }),
        new winstonDaily(dailyOption('error')),
    ],
});
