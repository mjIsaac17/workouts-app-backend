const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",
};

module.exports = { queries };
