const express = require('express');
const app = express();

const symptomController = require('./routes/symptom.controller');
const comorbidityController = require('./routes/comorbidity.controller');
const medicationController = require('./routes/medication.controller');

app.use(express.json());
app.use('/symptom', symptomController);
app.use('/comorbidity', comorbidityController);
app.use('/medication', medicationController);

const PORT = 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})