const router = require("express").Router();
const { getCurrentUserData, updateUserData } = require("../controllers/users");
const { validateUserData } = require("../utils/validate/userValidate");

router.get("/me", getCurrentUserData);
router.patch("/me", validateUserData, updateUserData);

module.exports = router;
