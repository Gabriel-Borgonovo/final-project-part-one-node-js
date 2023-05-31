import * as z from 'zod';
import { ValidatorError } from './validator.error.js';
import CustomError from '../custom.error.js';
import ErrorEnum from '../errors.enum.js';

/**
 * @template T
 * @param {z.ZodObject<T>} schema
 * @returns {(maybeValid: unknown) => T}
 */
export const validator = (schema) => (maybeValid) => {
  const result = schema.safeParse(maybeValid);
  if (!result.success) {
    //throw new ValidatorError(result.error.errors);
    CustomError.createError({
      name: 'validationError',
      cause: result.error.errors,
      message: JSON.stringify( result.error.errors.map(e => ({
        property: e.path.join("."),
        issue: e.message,
      }))),
      code: ErrorEnum.INVALID_TYPES_ERROR,
    });
  }
  return result.data;
};