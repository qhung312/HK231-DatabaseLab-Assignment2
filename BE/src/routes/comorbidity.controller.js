const { Router } = require("express");
const { pool } = require("../database/database_connection");

const comorbidityRouter = Router();

comorbidityRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comorbidity");
    res.status(200).json(result.rows);
  } catch(error) {
    res.status(400).statusMessage(`Error: ${error}`);
  }
});

comorbidityRouter.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comorbidity WHERE id = $1", [toNumber(req.params.id)]);
    res.status(200).json(result.rows[0]);
  } catch(error) {
    res.status(400).statusMessage(`Error: ${error}`);
  }
});

module.exports = comorbidityRouter;
