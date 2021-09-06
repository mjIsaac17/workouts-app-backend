const sql = require("mssql");

const dbConnection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.SERVER_NAME,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConnection);
    return pool;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getConnection, sql };
