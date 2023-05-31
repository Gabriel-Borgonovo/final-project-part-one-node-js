/**
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 * @description This middleware is used to send custom response
 * @param {ExpressRequest} req - Request object
 * @param {ExpressResponse} res - Response object
 * @param {ExpressNextFunction} next - Next function
 */
export default (req, res, next) => {
    res.okResponse = (data) => {
      res.status(200).send({
        status: 'success',
        payload: data,
      });
    };
    res.userErrorResponse = (message) => {
      res.status(400).send({
        status: 'error',
        error: message,
      });
    };
    res.serverErrorResponse = (message) => {
      res.status(500).send({
        status: 'error',
        error: message,
      });
    };
    next();
  };
  
  /**
   * @callback OkResponse
   * @param {any} data - Data to send
   */
  /**
   * @callback UserErrorResponse
   * @param {any} message - Error message
   */
  /**
   * @callback ServerErrorResponse
   * @param {any} message - Error message
   */
  
  /**
   * @typedef {Object} CustomResponse
   * @property {OkResponse} okResponse - Send a 200 response
   * @property {UserErrorResponse} userErrorResponse - Send a 400 response
   * @property {ServerErrorResponse} serverErrorResponse - Send a 500 response
   * @typedef {ExpressResponse & CustomResponse} Response
   */