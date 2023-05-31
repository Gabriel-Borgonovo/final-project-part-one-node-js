import ErrorEnum from '../errors.enum.js';

/**
 * Error middleware
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('./custom.response.middleware.js').Response} res
 * @param {import('express').NextFunction} Next
 * @returns {void}
 */

export default (error, req, res, next) => {
    console.log('error middleware', error.cause);
    switch(Math.floor(error.code / 100)){
        case 1: // Errores de entrada
            res.userErrorResponse(JSON.parse(error.message));
            break;
        case 2: //Errores lógicos
            res.userErrorResponse({
                message: 'Error lógico',
                error: JSON.parse(error.message)
            });
            break;
        case 3: // Errores de irrecuperables
            res.serverErrorResponse('UnhandledError');
            break;
        case 4: // Errores de irrecuperables
            res.serverErrorResponse('UnhandledError');
            break
        default:
            res.serverErrorResponse('UnhandledError');
    }
}