const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");

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
    const { name, description, image_name, muscleId } = req.body;
    const uid = req.uid;
    // //Encrypt password
    // const salt = bcrypt.genSaltSync();
    // const encryptedPassword = bcrypt.hashSync(password, salt);
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("image_name", sql.VarChar, image_name)
      .input("muscleId", sql.Int, muscleId)
      .input("userId", sql.Int, uid)
      .query(queries.addExercise);
    res.status(recordset[0].status).json(recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when inserting a new user");
  }
};

module.exports = {
  getExercisesById,
  addExercise,
};
