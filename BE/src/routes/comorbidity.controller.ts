import { Router } from 'express';

import ComorbidityService from '../services/comorbidity.service';
import { CustomResponse } from '../types/response';

const comorbidityController = Router();

comorbidityController.get('/', async (req, res: CustomResponse) => {
  try {
    const result = await ComorbidityService.getAllComorbidities();

    res.composer.ok(result);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default comorbidityController;
