const Sequelize = require('sequelize');
const db = require('../config/db');

const Projects = require('../models/Projects');



const Tasks = db.define( 'tasks', {
    id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    task: Sequelize.STRING(100),
    status: Sequelize.INTEGER(1)
});

Tasks.belongsTo(Projects);

module.exports = Tasks;