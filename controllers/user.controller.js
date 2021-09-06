const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");

const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("usp_Get_UsersDetails");
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when getting the users from the db" });
  }
};

/** SQL server returns:
 * status: (201, 404)
 * error: "Invalid email" or result: "User added"
 */
const addUser = async (req, res) => {
  try {
    const { name, lastname, email, password, image, role_id = 2 } = req.body;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("lastname", sql.VarChar, lastname)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .input("image", sql.VarChar, image)
      .input("role_id", sql.Int, role_id)
      .query(queries.addNewUser);
    res.status(recordset[0].status).json(recordset);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when inserting a new user");
  }
};

module.exports = {
  getUsers,
  addUser,
};
