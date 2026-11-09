require("dotenv").config();
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

function generateToken(user){
    return jwt.sign(
        { id: user.id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
}

async function register(req, res, next){
    try {
        const user = await userService.create(req.body);
        const token = generateToken(user);

        res.status(201).json({
            user: user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next){
    try {
        const { username, password } = req.body;

        const user = await userService.findByUsername(username);
        if(!user) return res.status(401).json({message: "Invalid username"});

        const validPassword = await userService.validatePassword(user, password);
        if(!validPassword) return res.status(401).json({message: "Invalid password"});

        const token = generateToken(user);

        res.json({
            user: user,
            token,
        })
    } catch (error) {
        next(error);
    }
}

module.exports= {
    register,
    login
}