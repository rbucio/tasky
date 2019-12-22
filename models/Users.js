const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt');


const Projects = require('./Projects')

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        validate: {
            isEmail: {
                msg: 'Email not valid.'
            },
            notEmpty: {
                msg: 'Please provide an email.'
            }
        },
        unique: {
            args: true,
            msg: 'Email already exist.'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please provide a password.'
            }
        }
    }
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync( user.password, bcrypt.genSaltSync(10));
        }
    }
});

Users.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Users.hasMany(Projects);

module.exports = Users;
