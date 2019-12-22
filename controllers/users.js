const passport = require('passport');
const Users = require('../models/Users');

// RENDER NEW USER FORM
exports.register = (req, res) => {
    res.render('users/register');
}

// CREATE NEW USER ACCOUNT
exports.create = async (req, res) => {
    const { email, password } = req.body;

    try {
        await Users.create({ email, password });
        res.redirect('/dashboard/user/login')
    } catch(errors) {
        res.render('users/register', {
            errors: errors.errors,
            email,
            password
        });
    }
}

// SHOW LOGIN FORM 
exports.login = (req, res) => {
    res.render('users/login');
}

// HANDLE LOGIN 
exports.auth = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/dashboard/user/login',
    failureFlash: true
})

// IS USER AUTHENTICATED
exports.authenticatedUser = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/dashboard/user/login');
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/dashboard/user/login');
    })
}

