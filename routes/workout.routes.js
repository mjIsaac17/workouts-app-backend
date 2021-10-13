const { Router } = require("express");
const {
  addWorkout,
  getWorkoutsByUserId,
  getWorkoutExercises,
  updateWorkout,
} = require("../controllers/workout.controller");

const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

//Middlewares
router.use(validateJWT);

router.get("/my-workouts", getWorkoutsByUserId);
router.get("/my-workouts/:workoutName", getWorkoutExercises);
router.post("/", addWorkout);
router.put("/:id", updateWorkout);

module.exports = router;
