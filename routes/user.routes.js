const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  registerUser,
  renewToken,
  getRoles,
} = require("../controllers/user.controller");

const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, getUsers);
router.get("/renew", validateJWT, renewToken);
router.get("/roles", getRoles);
router.post("/", loginUser);
router.post("/new", validateJWT, addUser);
router.post("/register", registerUser);

module.exports = router;
