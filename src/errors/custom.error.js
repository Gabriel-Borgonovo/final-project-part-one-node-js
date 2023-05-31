export default class CustomError {

    /**
     * @static
     * @param {Object} param
     * @param {String} [param.name = 'error']
     * @param {String} param.cause
     * @param {Object} param.message
     * @param {number} [param.code = 1]
     * @throws {Error}
     * @memberof CustomError
     */
    static createError({
        name='error',
        cause,
        message,
        code=1
    }) {
        const error = new Error(message, {cause});
        error.name = name;
        error.code = code;
        throw error;
    }
}