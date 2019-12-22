const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// IMPORT USER MODEL
const Users = require('../models/Users');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                // FIND USER TO LOGIN
                const user = await Users.findOne({
                    where: {
                        email: email
                    }
                })
                // IF USER EXIST BUT PASSWORD DOES NOT MATCH
                if(!user.verifyPassword(password)) {
                    return done(null, false, {
                        message: 'Wrong credentials.'
                    })
                }
                return done(null, user);

            } catch(error) {
                return done(null, false, {
                    message: 'Wrong credentials.'
                })
            }
        }
    )
);

passport.serializeUser( (user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

module.exports = passport;

