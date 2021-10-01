const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const fs = require("fs");

const getExercisesById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("id", sql.Int, id)
      .query(queries.getExercisesById);
    res.json(recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when trying to get the data");
  }
};

/** SQL server returns:
 * status: 201, 404, etc
 * error: "Invalid email" or result: "User added"
 * exerciseId: 1 (when there are no errors)
 */
const addExercise = async (req, res) => {
  try {
    const { name, description, muscleId } = req.body;
    const uid = req.uid;
    const image = req.files.image;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("image_name", sql.VarChar, image.name)
      .input("muscleId", sql.Int, muscleId)
      .input("userId", sql.Int, uid)
      .query(queries.addExercise);

    if (recordset[0].status == 201)
      image.mv(`../frontend-workouts-app/public/img/exercises/${image.name}`);

    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when inserting a new exercise");
  }
};

const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_name, muscleId } = req.body;
    const uid = req.uid;

    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("image_name", sql.VarChar, image_name)
      .input("muscleId", sql.Int, muscleId)
      .input("userId", sql.Int, uid)
      .query(queries.updateExercise);
    console.log(req.files);
    console.log(recordset[0]);

    if (recordset[0].status == 200) {
      try {
        if (recordset[0].deleteImage)
          fs.unlinkSync(
            `../frontend-workouts-app/public/img/exercises/${recordset[0].imageToDelete}`
          );

        const imageFile = req.files;
        if (imageFile)
          imageFile.image.mv(
            `../frontend-workouts-app/public/img/exercises/${imageFile.image.name}`
          );
      } catch (error) {
        console.log(error);
      }
    }
    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when updating an exercise");
  }
};

module.exports = {
  getExercisesById,
  addExercise,
  updateExercise,
};
