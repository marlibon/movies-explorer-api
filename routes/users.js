const router = require("express").Router();
const {
  getUsers,
  getCurrentUserData,
  updateUserData,
} = require("../controllers/users");
const { validateUserData } = require("../utils/validate/userValidate");

router.get("/me", getCurrentUserData);
router.get("/", getUsers);
router.patch("/me", validateUserData, updateUserData);

module.exports = router;
