const { Router } = require("express");
const { getUsers, addUser } = require("../controllers/user.controller");

const router = Router();

router.get("/", getUsers);
router.post("/", addUser);

module.exports = router;
