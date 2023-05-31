/**
 * @typedef {import('express').Request} Request
 * @typedef {import('./custom-response.middleware.mjs').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('../validators/validator.mjs').validator} Validator
 */

/**
 * @param {Validator} validator
 * @returns {function( Request, Response, NextFunction): void}
 */
export const validateBody = (validator) => (req, res, next) => {
    const validatedBody = validator(req.body);
    req.body = validatedBody;
    next();
  };
  
  /**
   * @param {function} validator
   * @returns {function( Request, Response, NextFunction): void}
   */
  export const validateParams = (validator) => (req, res, next) => {
    const validatedParams = validator(req.params);
    req.body = validatedParams;
    next();
  };
  
  /**
   * @param {function} validator
   * @returns {function( Request, Response, NextFunction): void}
   */
  export const validateQuery = (validator) => (req, res, next) => {
    const validatedQuery = validator(req.query);
    req.query = validatedQuery;
    next();
  };
  