const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

async function create({username, password, avatarUrl, displayName}){

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data:{
            username,
            password: hashedPassword,
            displayName,
            avatarUrl,
        }
    });

    return user;
}

async function findByUsername(username){
    return prisma.user.findUnique({
        where: { username },
    });
}

async function findById(id){
    const user = await prisma.user.findUnique({
        where:{id},
    });

    return user;
}

async function findProfileById(id){
    const user = await prisma.user.findUnique({
        where:{id},
        select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            createdAt: true,
        }
    });

    return user;
}

async function searchUsers({query, currentUserId, limit = 15}){
    
    const safeLimit = Math.min(limit, 20);

    const users = await prisma.user.findMany({
        where:{
            AND:[
                {
                    OR: [
                        {
                            username:{
                                contains: query,
                                mode: "insensitive"
                            },
                        },
                        {
                            displayName: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                {
                    NOT:{
                        id: currentUserId,
                    },
                },
            ],
        },
        take: safeLimit,
        select:{
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
        },
    });

    return users;
}

async function validatePassword (user, password){
    return bcrypt.compare(password, user.password);
}

async function update(id, data){
    const allowedFields = [ "displayName", "avatarUrl"];

    const filteredData= Object.fromEntries(
        Object.entries(data).filter(([key])=> allowedFields.includes[key]),
    );

    const user = await prisma.user.update({
        where: { id },
        data: filteredData,
    });

    return user;
}

async function removeUser(id){
    await prisma.user.delete({
        where: { id },
    });

    return;
}

module.exports = {
    create,
    findById,
    findByUsername,
    findProfileById,
    searchUsers,
    validatePassword,
    update,
    removeUser
}