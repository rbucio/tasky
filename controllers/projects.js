const Projects = require('../models/Projects.js');
const Tasks = require('../models/Tasks.js');

const { validationResult } = require('express-validator');

// RENDERS DASHBOARD VIEW
exports.dashboard = async function(req, res) {

    const { user } = res.locals;

    let projects = await Projects.findAll({
        where: {
            userId: user.id
        },
        order: [
            ['id', 'DESC']
        ],
        limit: 5
    })
    
    //  RETURN TASKS FOR ALL PROJECTS
    projects = await Promise.all(projects.map( async (project) =>  {
        const tasks =  await Tasks.findAll({
            where: {
                projectId: project.id
            }
        })

        // FILTER ALL COMPLETED TASKS FOR CURRENT PROJECT
        const completedTasks = tasks.filter( task => task.status === 1);
        //  CALCULTE PROJECT PROGRESS
        let progress;
        if(completedTasks.length) {
            progress = Math.round( (completedTasks.length / tasks.length) * 100);
        } else {
            progress = 0;
        }
        
        project.tasks = tasks.length;
        project.completedTasks = completedTasks.length;
        project.progress = progress === NaN ? 0 : progress;

        return project 
    }))
    
    res.render('projects/home', { projects , user  })
};

// RENDERS NEW PROJECT FORM
exports.new = async function(req, res) {
    res.render('projects/new-project');
}

// POST A NEW PROJECT
exports.create = async function(req, res) {
    // Pass any validation errors from request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('projects/new-project', { errors: errors.array() });
    } else {
        const { project_name } = req.body;
        const userId = res.locals.user.id;
        await Projects.create({ project_name, userId });
        res.redirect('/dashboard');
    }
}

// SHOW SINGLE PROJECT
exports.show = async function (req, res) {
    const project = await Projects.findOne({
        where: {
            id: req.params.id
        }
    });
    const tasks = await Tasks.findAll({
        where: {
            projectId: project.id
        }
    })
    res.render('projects/show', { project, tasks });
}

// SHOW EDIT FORM
exports.edit = async function(req, res) {
    const project = await Projects.findOne({
        where: {
            id: req.params.id
        }
    });

    res.render('projects/edit', { project });
}

// UPDATE PROJECT
exports.update = async function(req, res) {

    const errors = validationResult(req);

    const project = await Projects.findOne({
        where: {
            id: req.params.id
        }
    });
    
    if (!errors.isEmpty()) {
        res.render('projects/edit', { errors: errors.array(), project });
    } else {
        const { project_name } = req.body;
        await Projects.update({ project_name: project_name }, {
            where: {
                id: project.id
            }
        });
        res.redirect(`/dashboard/project/${project.id}`);
    }
}

// DELETE PROJECT 
exports.delete = async function(req, res) {
    try {

        await Projects.destroy({
            where: {
                id: req.params.id
            }
        })

        res.sendStatus(200);

    } catch(e) {
        res.status(500).send(e);
    }
}