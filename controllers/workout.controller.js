const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const fs = require("fs");

const getWorkoutsByUserId = async (req, res) => {
  try {
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("userId", sql.Int, uid)
      .query(queries.getWorkoutsByUserId);
    if (!recordset.status)
      //the data has no status code in the response
      res.status(200).json(recordset);
    else res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when trying to obtain the workouts" });
  }
};

const addWorkout = async (req, res) => {
  try {
    const { name, description, exerciseIds } = req.body;
    const uid = req.uid;
    let imageFile = req.files;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("imageName", sql.VarChar, imageFile ? imageFile.image.name : null)
      .input("userId", sql.Int, uid)
      .input("exerciseIds", sql.VarChar, exerciseIds)
      .query(queries.addWorkout);

    if (recordset[0].status == 201)
      if (imageFile)
        imageFile.image.mv(
          `../frontend-workouts-app/public/img/workouts/${imageFile.image.name}`
        );

    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when inserting a new workout" });
  }
};

const getWorkoutExercises = async (req, res) => {
  try {
    const { workoutName } = req.params;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("workoutName", sql.VarChar, workoutName)
      .input("userId", sql.Int, uid)
      .query(queries.getWorkoutExercises);
    if (!recordset[0].status)
      //the data has no status code in the response, it is valid
      res.status(200).json(recordset);
    else res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `An error ocurred when trying to obtain the exercises of '${workoutName} workout'`,
    });
  }
};

module.exports = { addWorkout, getWorkoutsByUserId, getWorkoutExercises };
