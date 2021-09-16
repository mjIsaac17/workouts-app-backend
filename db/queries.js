const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",

  //Muscle
  getMusclesData: "SELECT * FROM tblMuscle",
};

module.exports = { queries };
