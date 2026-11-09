const prisma = require("../lib/prisma.js");

async function getUserChats(userId, {cursor, limit = 20}){
    const chats = await prisma.chat.findMany({
        where: {
            chatMembers: {
                some: {userId},
            },
        },
        orderBy:{
            updatedAt: "desc",
        },
        take: limit,
        ...(cursor &&{
            skip: 1,
            cursor: { id: cursor },
        }),
        include: {
            chatMembers:{
                include:{
                    user:{
                        select:{
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            messages:{
                orderBy: { createdAt: "desc"},
                take: 1,
            },
        },
    });

    return chats;
}

async function createChat({currentUserId, userIds = [], name}){

    const isGroup = uniqueUserIds.length > 2;

    const chat = await prisma.chat.create({
        data: {
            name: isGroup ? name : null,
            isGroup,
            createdById: Number(currentUserId),
            chatMembers: {
                create: uniqueUserIds.map((userId)=>({
                    userId,
                })),
            },
        },
        include: {
            chatMembers:{
                include:{
                    user:{
                        select:{
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
    });

    return chat;
}

async function getChatById (chatId, userId, { cursor, limit = 50} = {}){
    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            chatMembers: {
                some: {userId},
            },
        },
        include: {
            chatMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            messages:{
                orderBy: { createdAt: "desc" },
                take: limit,
                ...(cursor && {
                    skip: 1,
                    cursor: { id: cursor },
                }),
            },
        },
    });

    return chat;
}

async function editChat({ chatId, name, currentUserId }) {

    const membership = await prisma.chatMember.findUnique({
        where: {
            userId_chatId: {
                userId: currentUserId,
                chatId,
            },
        },
    });

    if (!membership) {
        throw new Error("Not authorized to modify this chat");
    }

    if (!name || name.trim() === "") {
        throw new Error("Chat name cannot be empty");
    }

    const oldChat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { name: true },
    });

    await prisma.chat.update({
        where: { id: chatId },
        data: {
            name,
            updatedAt: new Date(),
        },
    });

    if(oldChat?.name === name){
        return oldChat;
    }

    return getChatById(chatId, currentUserId);
}

async function addUserToChat({chatId, currentUserId, userIdToAdd}){
    const membership = await prisma.chatMember.findUnique({
        where: {
            userId_chatId: {
                userId: currentUserId,
                chatId,
            },
        },
    });

    if(!membership){
        throw new Error("Not authorized to modify this chat");
    }

    const existing  = await prisma.chatMember.findUnique({
        where:{
            userId_chatId:{
                userId: userIdToAdd,
                chatId,
            },
        },
    });

    if(!existing){
        await prisma.chatMember.create({
            data:{
                chatId,
                userId: userIdToAdd,
            }
        });
    }

    const memberCount = await prisma.chatMember.count({
        where: { chatId }
    });

    await prisma.chat.update({
        where: { id: chatId },
        data:{
            updatedAt: new Date(),
            isGroup: memberCount > 2,
        }
    });

    return getChatById(chatId, currentUserId);
}

async function removeUserFromChat({chatId, currentUserId, userIdToRemove}){
    const membership = await prisma.chatMember.findUnique({
        where: {
            userId_chatId: {
                userId: currentUserId,
                chatId,
            },
        },
    });

    if (!membership) {
        throw new Error("Not authorized to modify this chat");
    };

    await prisma.chatMember.delete({
        where: {
            userId_chatId: {
                userId: userIdToRemove,
                chatId,
            }
        }
    });

    const memberCount = await prisma.chatMember.count({
        where: { chatId },
    });

    await prisma.chat.update({
        where: { id: chatId },
        data: {
            isGroup: memberCount > 2,
            updatedAt: new Date(),
        },
    });

    return getChatById(chatId, currentUserId);
}

module.exports = {
    getUserChats,
    createChat,
    getChatById,
    editChat,
    addUserToChat,
    removeUserFromChat
}