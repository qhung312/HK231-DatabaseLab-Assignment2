const { Router } = require("express");
const { pool } = require("../database/database_connection");
const { toNumber } = require("lodash");

const symptomController = Router();

symptomController.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM symptom");
    res.status(200).json(result.rows);
  } catch(error) {
    res.status(400).statusMessage(`Error: ${error}`);
  }
});

symptomController.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM symptom WHERE id = $1", [toNumber(req.params.id)]);
    if (result.rowCount === 0) {
      res.status(200).json(null);
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch(error) {
    res.status(400).statusMessage(`Error: ${error}`);
  }
});

module.exports = symptomController

