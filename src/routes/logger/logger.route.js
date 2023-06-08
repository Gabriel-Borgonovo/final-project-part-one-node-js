import { Router } from "express";
import logger from "../../logger/logger.js";

const route = Router();


route.get('/', async (req, res, next) => {
    try {
      logger.fatal("fatal Error");
      logger.error("Error");
      logger.warning("warning");
      logger.info("info");
      logger.http("http");
      logger.debug("debug");

      res.send({logger: 'loggers por consola'});
    } catch (error) {
      logger.error(error);
      next(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default route;