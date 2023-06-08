import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: 'green',
        debug: "white",
    }
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    level:'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    timestamp: true,
    transports: [
        new winston.transports.File({
            filename: './log/error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: './log/combined.log'}),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(),
            ),
        }),
    );

    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(),
            ),
            level: "debug",
        }),
    )
}

export default logger;



