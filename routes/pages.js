const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('../controllers/pages.js');

module.exports = function() {
    router.get('/', homeController.home);

    return router;
}