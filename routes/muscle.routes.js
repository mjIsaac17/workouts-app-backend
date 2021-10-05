const { Router } = require("express");
const {
  getMuscles,
  addMuscle,
  updateMuscle,
  deleteMuscle,
} = require("../controllers/muscle.controller");

const router = Router();

router.get("/", getMuscles);
router.post("/", addMuscle);
router.put("/:id", updateMuscle);
router.delete("/:id", deleteMuscle);

module.exports = router;
