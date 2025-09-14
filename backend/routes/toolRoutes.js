const express = require('express');
const router = express.Router();
const { 
    getAllTools, 
    addTool, 
    deleteTool,
    issueTool,
    returnTool,
    getToolHistory,
    getMaintenanceReport
} = require('../controllers/toolController');

// All routes are now public
router.route('/').get(getAllTools).post(addTool);
router.route('/:id').delete(deleteTool);
router.route('/:id/history').get(getToolHistory);
router.route('/maintenance/report').get(getMaintenanceReport);
router.post('/issue', issueTool);
router.post('/return', returnTool);

module.exports = router;