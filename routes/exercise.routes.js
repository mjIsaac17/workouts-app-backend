const { Router } = require("express");
const {
  getExercisesById,
  addExercise,
} = require("../controllers/exercise.controller");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();
//Middlewares
router.use(validateJWT);

router.get("/:id", getExercisesById);
router.post("/", addExercise);

module.exports = router;
