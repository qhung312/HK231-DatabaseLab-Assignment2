const { Router } = require("express");
const { pool } = require("../database/database_connection");

const medicationController = Router();

medicationController.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medication");
    res.status(200).json(result.rows);
  } catch(error) {
    res.status(400).statusMessage(error.message);
  }
});

medicationController.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM medication WHERE id = $1", [id]);
    if (_.isEmpty(result.rows)) {
      throw new Error(`No medication with id ${id} found`);
    }
    res.status(200).json(result.rows);
  } catch(error) {
    res.status(400).statusMessage(error.message);
  }
});

module.exports = medicationController;