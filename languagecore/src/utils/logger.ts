import winston from "winston";

export const log = winston.createLogger({
  level: "debug",
  transports: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
});
