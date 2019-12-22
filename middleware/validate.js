const { check } = require('express-validator');

exports.project = [
    // Validate form values
    check('project_name').isLength({ min: 1 }).withMessage("Project name can't be blank.")

]