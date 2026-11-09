require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const {configurePassport} = require("./middleware/passport");
const userRouter = require("./routes/userRouter");
const messageRouter = require("./routes/messageRouter");
const chatRouter = require("./routes/chatRouter");
const errorHandler = require("./middleware/errorHandler");
const app = express();


const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((origin)=>origin.trim());

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

configurePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chats", chatRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error)=>{
    if(error){
        console.log(error);
    }
    console.log(`App is listening on port ${PORT}`);
})