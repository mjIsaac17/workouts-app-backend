const fs = require("fs");
const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");

const getMuscles = async (req, res) => {
  try {
    const pool = await getConnection();
    const { recordset } = await pool.request().query(queries.getMusclesData);
    res.json(recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when trying to get the data");
  }
};

/** SQL server returns:
 * status: (201, 404)
 * error: "Invalid email"
 */
const addMuscle = async (req, res) => {
  try {
    const { name } = req.body;
    const uid = req.uid;
    const image = req.files.image;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("imageName", sql.VarChar, image.name)
      .input("userId", sql.Int, uid)
      .query(queries.addMuscle);

    if (recordset[0].status == 201)
      image.mv(`../frontend-workouts-app/public/img/muscles/${image.name}`);

    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when inserting a new muscle");
  }
};

const updateMuscle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, originalImageName, imageName } = req.body;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("muscleId", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("imageName", sql.VarChar, imageName) //contains either the original image name or the new one
      .input("userId", sql.Int, uid)
      .query(queries.updateMuscle);

    if (recordset[0].status == 200) {
      try {
        //If there is a file image, delete the previous one to move the new one
        const imageFile = req.files;
        if (imageFile) {
          fs.unlinkSync(
            `../frontend-workouts-app/public/img/muscles/${originalImageName}`
          );
          imageFile.newImage.mv(
            `../frontend-workouts-app/public/img/muscles/${imageName}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when updating a muscle");
  }
};

const deleteMuscle = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageName, deleteExercises } = req.body;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("muscleId", sql.Int, id)
      .input("userId", sql.Int, uid)
      .input("deleteExercises", sql.Bit, deleteExercises)
      .query(queries.deleteMuscle);

    if (recordset[0].status == 200) {
      try {
        fs.unlinkSync(
          `../frontend-workouts-app/public/img/muscles/${imageName}`
        );
      } catch (error) {
        console.log(error);
      }
    }
    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when deleting a muscle");
  }
};

module.exports = {
  getMuscles,
  addMuscle,
  updateMuscle,
  deleteMuscle,
};
