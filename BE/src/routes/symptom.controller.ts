import { Router } from 'express';

import SymptomService from '../services/symptom.service';
import { CustomResponse } from '../types/response';

const symptomController = Router();

symptomController.get('/', async (req, res: CustomResponse) => {
  try {
    const result = await SymptomService.getAllSymptoms();

    res.composer.ok(result);
  } catch (error) {
    res.composer.badRequest(error.message);
  }
});

export default symptomController;
