const prisma = require("../lib/prisma.js");

async function createMessage({chatId, senderId, content}){
    return prisma.$transaction(async (tx)=>{
        const memberShip = await tx.chatMember.findUnique({
            where: {
                userId_chatId: {
                    userId: senderId,
                    chatId,
                },
            },
        });

        if(!memberShip){
            throw new Error("Not authorized to send messages in this chat");
        }

        const message = await tx.message.create({
            data:{
                chatId,
                senderId,
                content,
            },
        });

        await tx.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });

        return message;
    });
}

async function editMessage({messageId, userId, content}){
    return prisma.$transaction(async (tx)=>{
        const result = await tx.message.updateMany({
            where:{
                id: messageId,
                senderId: userId,
                deletedAt: null,
            },
            data: {
                content,
                editedAt: new Date(),
            },
        });

        if(result.count === 0){
            throw new Error("Message not editable");
        }

        //get chatId to update chat timestamp
        const message = tx.message.findUnique({
            where: { id: messageId },
            select: { chatId: true },
        });

        await tx.chat.update({
            where: { id: message.chatId },
            data: { updatedAt: new Date() }
        });

        return message;
    })
}

async function deleteMessage({messageId, userId}){
    return prisma.$transaction( async (tx)=>{
        const result = tx.message.updateMany({
            where: {
                id: messageId,
                senderId: userId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                content: "",
            },
        });

        if(result.count === 0){
            throw new Error("message not found");
        }

        const message = await tx.message.findUnique({
            where: { id: message.chatId },
            select: { chatId: true },
        });

        await tx.chat.update({
            where: { id: message.chatId },
            data: { updatedAt: new Date() }
        });
    });
}

module.exports = {
    createMessage,
    editMessage,
    deleteMessage
}