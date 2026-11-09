require("dotenv").config();
const passport = require("passport");
const {Strategy: JwtStrategy, ExtractJwt} = require("passport-jwt");

const userService = require("../services/userService");

function configurePassport(){
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new JwtStrategy(opts, async(payload, done)=>{
            try {
                const user = await userService.findById(payload.id);

                if(!user){
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );
}

module.exports = { configurePassport };
