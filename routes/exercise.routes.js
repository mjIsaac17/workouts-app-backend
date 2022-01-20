const { Router } = require("express");
const {
  getExercisesById,
  addExercise,
  updateExercise,
  deleteExercise,
  addExistingExercise,
} = require("../controllers/exercise.controller");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();
//Middlewares
router.use(validateJWT);

//TODO-add validateFields() to know if the token expired
router.get("/:id", getExercisesById);
router.post("/", addExercise);
router.post("/:id", addExistingExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
