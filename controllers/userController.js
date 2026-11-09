const userService = require("../services/userService.js");

async function getMe(req, res){
    res.json(req.user);
}

async function updateMe(req, res, next){
    try {
        const updated = await userService.update(req.user.id, req.body);

        res.status(201).json(updated);
    } catch (error) {
        next(error);
    }
}

async function deleteMe(req, res, next){
    try {
        await userService.removeUser(req.user.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function searchUsers(req, res, next){
    try {
        const { search, limit} = req.query;

        if(!search || typeof search !== "string"){
            return res.status(400).json({message: "Search query is required"});
        }

        const users = await userService.searchUsers({
            query: search.trim(),
            currentUserId: req.user.id,
            limit: limit ? Number(limit) : 15,
        });

        res.status(201).json(users);

    } catch (error) {
        next(error)
    }
}

async function getProfile(req, res, next){
    try {
        const user = await userService.findProfileById(req.params.userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMe,
    updateMe,
    deleteMe,
    searchUsers,
    getProfile
}