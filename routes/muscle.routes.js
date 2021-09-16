const { Router } = require("express");
const { getMuscles } = require("../controllers/muscle.controller");

const router = Router();

router.get("/", getMuscles);

module.exports = router;
