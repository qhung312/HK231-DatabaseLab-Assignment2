import { NextFunction, Request } from 'express';
import _ from 'lodash';

import { CustomResponse } from '../types';

export default function authMiddleware(req: Request, res: CustomResponse, next: NextFunction) {
  const userId = _.get(req.session, 'username');
  if (_.isNil(userId)) {
    res.composer.unauthorized('You must be authenticated to perform this action');
    return;
  }
  next();
}
