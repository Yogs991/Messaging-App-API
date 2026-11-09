const {Router} = require("express");
const authController = require("../controllers/authController");

const router = Router();
//Register new user
router.post("/register", authController.register);
//Login new user
router.post("/login", authController.login);

module.exports = router;