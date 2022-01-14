const queries = {
  //User
  addNewUser:
    "usp_Insert_User @name, @lastname, @email, @password, @image, @role_id",
  userLogin: "usp_Get_UserByEmail @email",
  getRoles: "usp_Get_Roles",
  updateUser: "usp_Update_User @id, @name, @lastname, @email, @role_id",
  deleteUser: "usp_Delete_User @userId",
  getUsers: "usp_Get_UsersDetails @roleId, @currentUserId",

  //Muscle
  getMusclesData: "SELECT * FROM tblMuscle",
  addMuscle: "usp_Add_Muscle @name, @imageName, @imageUrl, @userId",
  updateMuscle: "usp_Update_Muscle @id, @name, @imageName, @imageUrl, @userId",
  deleteMuscle: "usp_Delete_Muscle @id, @userId, @deleteExercises",

  //Exercise
  getExercisesById: "usp_Get_ExercisesByMuscleId @id",
  addExercise:
    "usp_Add_Exercise @name, @description, @imageName, @imageUrl, @muscleNames, @userId",
  updateExercise:
    "usp_Update_Exercise @id, @name, @description, @imageName, @imageUrl, @muscleId, @userId",
  deleteExercise: "usp_Delete_Exercise @exerciseId, @userId",

  //Workout
  getWorkoutsByUserId: "usp_Get_WorkoutsByUserId @userId",
  getWorkoutExercises: "usp_Get_WorkoutExercisesByName @workoutName, @userId",
  addWorkout:
    "usp_Add_Workout @name, @description, @imageName, @imageUrl, @userId, @exerciseIds",
  updateWorkout:
    "usp_Update_Workout @workoutId, @name, @description, @imageName, @imageUrl, @exerciseIds",
  deleteWorkout: "usp_Delete_Workout @workoutId",
};

module.exports = { queries };
