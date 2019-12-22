const express = require('express');
const router = express.Router();
const validator = require('../middleware/validate.js');


// Controllers
const projectsController = require('../controllers/projects.js');
const tasksController = require('../controllers/tasks.js');
const usersController = require('../controllers/users.js');


module.exports = function() {

    // PROJECT ROUTES
    router.get('/', 
        usersController.authenticatedUser,
        projectsController.dashboard
    );
    router.get('/new-project', 
        usersController.authenticatedUser,
        projectsController.new
    );
    router.post('/new-project',
        usersController.authenticatedUser,
        projectsController.create
    );
    router.get('/project/:id', 
        usersController.authenticatedUser,
        projectsController.show
    );
    router.get('/project/:id/edit', 
        usersController.authenticatedUser,
        projectsController.edit
    );
    router.post('/project/:id',
        usersController.authenticatedUser, 
        projectsController.update
    );
    router.delete('/project/:id/delete', 
        usersController.authenticatedUser,
        projectsController.delete
    );

    // TASKS ROUTES
    router.post('/project/:id/task', 
        usersController.authenticatedUser,
        tasksController.createTask
    );
    router.patch('/project/:projectId/task/:id/complete',
        usersController.authenticatedUser, 
        tasksController.complete
    );
    router.delete('/project/:projectId/task/:id/delete',
        usersController.authenticatedUser, 
        tasksController.deleteTask
    );

    // USERS CONTROLLER
    router.get('/user/register', usersController.register);
    router.post('/user/register', usersController.create);
    router.get('/user/login', usersController.login);
    router.post('/user/login', usersController.auth);
    router.get('/user/logout', usersController.logout);
    
    return router;
}