const chatService = require("../services/chatService");

async function getChats(req, res, next){
    try {
        const { cursor, limit } = req.query;

        const safeLimit = Math.min(Number(limit) || 20, 50);

        const chats = await chatService.getUserChats(req.user.id, {
            cursor,
            limit: safeLimit,
        });

        res.json({
            data: chats,
            nextCursor: chats.length ? chats[chats.length -1].id : null,
        });
    } catch (error) {
        next(error);
    }
}

async function createChat(req, res, next){
    try {
        const { userIds = [], name } = req.body;

        const chat = await chatService.createChat({
            currentUserId: req.user.id,
            userIds,
            name,
        });

        res.status(201).json(chat);
    } catch (error) {
        next(error)
    }
}

async function getChatById(req, res, next){
    try {
        const {chatId} = req.params;

        const { cursor, limit } = req.query;
        
        const safeLimit = Math.min(Number(limit) || 20, 50);

        const chat = await chatService.getChatById(chatId, req.user.id, {cursor, limit: safeLimit});

        if(!chat){
            return res.status(404).json({message: "chat not found"});
        }

        const messages = chat.messages || [];

        res.json({
            ...chat,
            messages,
            nextCursor: messages.length ? messages[messages.length - 1 ].id: null,
        });
    } catch (error) {
        next(error)
    }
}

async function editChat(req, res, next){
    try {
        const { chatId } = req.params;
        const { name } = req.body;

        const updatedChat = await chatService.editChat({
            chatId,
            name,
            currentUserId: req.user.id,
        });

        res.json(updatedChat);
    } catch (error) {
        next(error)
    }
}

async function addUser(req, res, next){
    try {
        const {chatId} = req.params;
        const {userId} = req.body;
        const updatedChat = await chatService.addUserToChat({
            chatId,
            currentUserId: req.user.id,
            userIdToAdd: userId
        });

        res.json(updatedChat);
    } catch (error) {
        next(error);
    }
}

async function removeUser(req, res, next){
    try {
        const {chatId} = req.params;

        await chatService.removeUserFromChat({
            chatId,
            currentUserId: req.user.id,
            userIdToRemove: req.user.id,
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getChats,
    createChat,
    getChatById,
    editChat,
    addUser,
    removeUser
}