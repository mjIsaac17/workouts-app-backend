const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",

  //Muscle
  getMusclesData: "SELECT * FROM tblMuscle",

  //Exercise
  getExercisesById: "usp_Get_ExercisesByMuscleId @id",
};

module.exports = { queries };
