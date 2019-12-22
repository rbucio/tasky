const Sequelize = require('sequelize');
const db = require('../config/db.js');

// DEFINING PROJECTS MODEL
const Projects = db.define('projects', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_name: {
        type: Sequelize.STRING
    }
});

module.exports = Projects;