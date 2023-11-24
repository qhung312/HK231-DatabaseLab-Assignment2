import { ValidationError, validateOrReject } from 'class-validator';
import _ from 'lodash';

function getAllConstraintsOfError(error: ValidationError): string[] {
  return [
    ...Object.values(error.constraints),
    ..._.flatMap(error.children, getAllConstraintsOfError)
  ];
}

function getAllConstraints(errors: ValidationError[]): string[] {
  return _.flatMap(errors, getAllConstraintsOfError);
}

/**
 * Because validateOrReject rejects with an array of ValidationError,
 * it doesn't work well when we need to respond with a badRequest(error.message)
 * This function wraps validateOrReject and rejects with the first error message
 */
export default function customValidateOrReject(obj: object) {
  return new Promise((resolve, reject) => {
    validateOrReject(obj)
      .then(() => resolve(obj))
      .catch((errors: ValidationError[]) => reject(new Error(getAllConstraints(errors)[0])));
  });
}
