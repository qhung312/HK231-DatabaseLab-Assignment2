import { Request, Router } from 'express';
import _ from 'lodash';

import { CustomResponse } from '../types';

const meController = Router();

meController.get('/', (req: Request, res: CustomResponse) => {
  try {
    const username = _.get(req.session, 'username');
    if (_.isNil(username)) {
      res.composer.ok(null);
    } else {
      res.composer.ok({ username });
    }
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default meController;
