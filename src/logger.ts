import path from "path";
import pino from "pino";

export const logger = pino(
    {},
    pino.destination(path.join(process.cwd(), "logs/arquivo-de-log.log")),
);
