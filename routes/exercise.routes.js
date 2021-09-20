const { Router } = require("express");
const { getExercisesById } = require("../controllers/exercise.controller");

const router = Router();

router.get("/:id", getExercisesById);

module.exports = router;
