const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  registerUser,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", getUsers);
router.post("/", loginUser);
router.post("/new", addUser);
router.post("/register", registerUser);

module.exports = router;
