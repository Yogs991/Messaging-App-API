const { body, param} = require("express-validator");
const validationResult = require("express-validator");


//AUTH
const validateRegister = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters"),
    
    body("displayName")
        .trim()
        .notEmpty()
        .withMessage("Display name is required"),
    
    body("avatarUrl")
        .optional()
        .isURL()
        .withMessage("Avatar must be a valid URL"),
];

const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

//USER

const validateUpdateProfile = [
    body("displayName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Display name cannot be empty"),
    
    body("avatarUrl")
        .optional()
        .isURL()
        .withMessage("Avatar must be a valid URL"),
];

//CHAT

const validateCreateChat = [
    body("userIds")
        .optional()
        .isArray()
        .withMessage("userIds must be an array"),

    body("userIds.*")
    .optional()
    .isUUID()
    .withMessage("Each userId must be a valid UUID"),

    body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Chat name cannot be empty"),
];

const validateEditChat = [
    param("chatId")
        .isUUID()
        .withMessage("Invalid chatId"),
    
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Chat name is required"),
];

//ERROR HANDLER

export function handleValidationErrors(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    next();
}

module.exports= {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateCreateChat,
    validateEditChat,
}


