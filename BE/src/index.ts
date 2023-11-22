import express from 'express';

import { comorbidityController, symptomController, medicationController } from './routes/index';
import { applyHttpComposer } from './types/response';

const app = express();

app.use(applyHttpComposer);
app.use(express.json());
app.use('/symptom', symptomController);
app.use('/comorbidity', comorbidityController);
app.use('/medication', medicationController);

const PORT = 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
