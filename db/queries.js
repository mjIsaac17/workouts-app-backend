const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",
  userLogin: "usp_Get_UserByEmail @email",
  getRoles: "usp_Get_Roles",
  updateUser: "usp_Update_User @id, @name, @lastname, @email, @role_id",
  deleteUser: "usp_Delete_User @userId",

  //Muscle
  getMusclesData: "SELECT * FROM tblMuscle",
  addMuscle: "usp_Add_Muscle @name, @imageName, @userId",
  updateMuscle: "usp_Update_Muscle @muscleId, @name, @imageName, @userId",
  deleteMuscle: "usp_Delete_Muscle @muscleId, @userId, @deleteExercises",

  //Exercise
  getExercisesById: "usp_Get_ExercisesByMuscleId @id",
  addExercise:
    "usp_Add_Exercise @name, @description, @imageName, @muscleId, @userId",
  updateExercise:
    "usp_Update_Exercise @id, @name, @description, @imageName, @muscleId, @userId",
  deleteExercise: "usp_Delete_Exercise @exerciseId, @userId",

  //Workout
  getWorkoutsByUserId: "usp_Get_WorkoutsByUserId @userId",
  getWorkoutExercises: "usp_Get_WorkoutExercisesByName @workoutName, @userId",
  addWorkout:
    "usp_Add_Workout @name, @description, @imageName, @userId, @exerciseIds",
  updateWorkout:
    "usp_Update_Workout @workoutId, @name, @description, @imageName, @exerciseIds",
  deleteWorkout: "usp_Delete_Workout @workoutId",
};

module.exports = { queries };
