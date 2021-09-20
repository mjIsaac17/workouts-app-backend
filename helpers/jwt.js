const jwt = require("jsonwebtoken");

const generateJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("It was not possible to generate the auth token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
