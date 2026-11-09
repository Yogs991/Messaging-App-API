const messageService = require("../services/messageService");

async function createMessage(req, res, next){
    try {
        const { chatId } = req.params;
        const { content } = req.body;

        const message = await messageService.createMessage({
            chatId,
            senderId: req.user.id,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        next(error)
    }
}

async function editMessage(req, res, next){
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const updatedMessage = await messageService.editMessage({
            messageId,
            userId: req.user.id,
            content,
        });

        res.status(201).json(updatedMessage);
    } catch (error) {
        next(error);
    }
}

async function deleteMessage(req, res, next){
    try {
        
        const { messageId } = req.params;

        await messageService.deleteMessage({
            messageId,
            userId: req.user.id,
        });

        res.status(204).end();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createMessage,
    editMessage,
    deleteMessage
}