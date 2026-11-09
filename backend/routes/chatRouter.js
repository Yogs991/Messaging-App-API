const {Router} = require("express");
const requireAuth = require("../middleware/auth.js");
const chatController = require("../controllers/chatController");
const messageController = require("../controllers/messageController.js");

const router = Router();
//Get all chats for user
router.get("/", requireAuth, chatController.getChats);
//Create chat
router.post("/", requireAuth, chatController.createChat);
//Get chat by id
router.get("/:chatId", requireAuth, chatController.getChatById);
//Edit chat
router.patch("/:chatId", requireAuth, chatController.editChat);
//Add user to chat
router.post("/:chatId/users", requireAuth, chatController.addUser);
//Leave chat
router.delete("/:chatId/users/me", requireAuth, chatController.removeUser);
//Add message to chat
router.post("/:chatId/messages", requireAuth, messageController.createMessage);

module.exports = router;

