const {Router} = require("express");
const requireAuth = require("../middleware/auth.js");
const userController = require("../controllers/userController.js");

const router = Router();
//Get account info
router.get("/me", requireAuth, userController.getMe);
//Update account info
router.patch("/me", requireAuth, userController.updateMe);
//Delete my account
router.delete("/me", requireAuth, userController.deleteMe);
//Search users
router.get("/", requireAuth, userController.searchUsers);
//Get profile
router.get("/", requireAuth, userController.getProfile);

module.exports = router;