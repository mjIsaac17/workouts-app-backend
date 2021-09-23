const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",
  userLogin: "usp_Get_UserByEmail @email",

  //Muscle
  getMusclesData: "SELECT * FROM tblMuscle",

  //Exercise
  getExercisesById: "usp_Get_ExercisesByMuscleId @id",
  addExercise:
    "usp_Add_Exercise @name, @description, @image_name, @muscleId, @userId",
};

module.exports = { queries };
