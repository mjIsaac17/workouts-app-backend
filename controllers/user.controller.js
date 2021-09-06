const { getConnection } = require("../db/connection");

const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("usp_Get_UsersDetails");
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ error: "An error ocurred when getting the users from the db" });
  }
};

module.exports = {
  getUsers,
};
