const {Router} = require("express");
const requireAuth = require("../middleware/auth.js");
const messageController = require("../controllers/messageController.js");

const router = Router();
//Edit message
router.patch("/:messageId", requireAuth, messageController.editMessage);
//Delete message
router.delete(":messageId", requireAuth, messageController.deleteMessage);

module.exports = router;
