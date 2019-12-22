const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');


// CREATE A NEW TASK
exports.createTask = async (req, res) => {
    // FIND CURRENT PROJECT
    const project = await Projects.findOne({ where: { id: req.params.id }});
    // GET VALUE FROM FORM 
    const task = req.body.task_name;
    // SET TASK STATUS 
    const status = 0;
    // PROJECT ID
    const projectId = project.id;

    try {
        await Tasks.create({ task, status, projectId });
        res.redirect(`/dashboard/project/${project.id}`);
    } catch(e) {
        console.log(e)
    }
}

// UPDATA TASK STATUS
exports.complete = async (req, res) => {
    // FIND TASK
    const { id, projectId } = req.params;
    const task = await Tasks.findOne({ 
        where: { id, projectId }
    });

    // UPDATE TASK STATUS
    task.status = task.status ? 0 : 1;
    // SAVE TASK
    try {
        await task.save();
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send(e);
    }
}

// DELETE TASK
exports.deleteTask = async (req, res) => {
    const { id, projectId } = req.params;
    
    try {
        await Tasks.destroy({
            where: {
                id,
                projectId
            }
        })
        res.sendStatus(200);
    } catch(e) {
        res.status(500).send(e);
    }
}
