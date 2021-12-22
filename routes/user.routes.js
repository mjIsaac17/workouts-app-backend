const { Router } = require("express");
const {
  getUsers,
  addUser,
  loginUser,
  registerUser,
  renewToken,
  getRoles,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get("/", validateJWT, getUsers);
router.get("/renew", validateJWT, renewToken);
router.get("/roles", getRoles);
router.post("/", loginUser);
router.post("/new", validateJWT, addUser);
router.post("/register", registerUser);
router.put("/:id", validateJWT, updateUser);
router.delete("/:id", validateJWT, deleteUser);

module.exports = router;
