const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const { generateJWT } = require("../helpers/jwt");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(queries.userLogin);

    //Invalid email, there is no user with the email sent
    if (recordset.length == 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const [user] = recordset;
    const { id, name, role_id } = user;

    //Validate password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = await generateJWT(id, name, role_id);

    res.json({ id, name, role_id, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when getting the users from the db" });
  }
};

const renewToken = async (req, res) => {
  const { uid, name, role_id } = req;
  //console.log("req role", role_id);

  const token = await generateJWT(uid, name, role_id);

  res.json({ uid, name, role_id, token });
};

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

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("lastname", sql.VarChar, lastname)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, encryptedPassword)
      .input("image", sql.VarChar, image)
      .input("role_id", sql.Int, role_id)
      .query(queries.addNewUser);
    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when adding a new user");
  }
};

/** SQL server returns:
 * status: (201, 404)
 * error: "Invalid email" or result: "User added"
 */
const registerUser = async (req, res) => {
  try {
    const { name, lastname, email, password, image } = req.body;

    //Encrypt password
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("lastname", sql.VarChar, lastname)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, encryptedPassword)
      .input("image", sql.VarChar, image)
      .input("role_id", sql.Int, process.env.DEFAULT_USER_ROLE_ID)
      .query(queries.addNewUser);

    const [result] = recordset;
    //Check if the user was created
    if (result.status === 400) {
      return res.status(400).json(result);
    }

    //User created. It will be authenticated.
    const token = await generateJWT(result.userId, `${name} ${lastname}`);
    const user = {
      id: result.userId,
      name,
      lastname,
      image,
      token,
    };

    res.status(result.status).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("An error ocurred when registering a new user");
  }
};

const getRoles = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queries.getRoles);
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when getting the users from the db" });
  }
};

module.exports = {
  loginUser,
  renewToken,
  getUsers,
  getRoles,
  addUser,
  registerUser,
};
