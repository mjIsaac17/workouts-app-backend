const { Router } = require("express");
const {
  getExercisesById,
  addExercise,
  updateExercise,
} = require("../controllers/exercise.controller");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();
//Middlewares
router.use(validateJWT);

//TODO-add validateFields() to know if the token expired
router.get("/:id", getExercisesById);
router.post("/", addExercise);
router.put("/:id", updateExercise);

module.exports = router;
