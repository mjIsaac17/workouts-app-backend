const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  registerUser,
  renewToken,
} = require("../controllers/user.controller");

const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get("/", getUsers);
router.get("/renew", validateJWT, renewToken);
router.post("/", loginUser);
router.post("/new", addUser);
router.post("/register", registerUser);

module.exports = router;
