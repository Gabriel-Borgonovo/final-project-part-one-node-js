/**
 * @typedef {import('zod').ZodError} ZodError
 * @typedef {ZodError["errors"]} Issues
 */

export class ValidatorError extends Error {
    /**
     * @param {Issues} errors
     */
    constructor(errors) {
      super();
      this.errors = errors;
    }
  
    get message() {
      return this.errors;
    }
  
    get name() {
      return 'ValidatorError';
    }
  }
  