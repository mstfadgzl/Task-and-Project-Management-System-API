const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController.js');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proje işlemleri
router.post('/',authMiddleware.verifyToken,authMiddleware.isAdmin, projectController.createProject);
router.get('/:projectId', projectController.getProjectById);
router.get('/:projectId/stats', projectController.getProjectStats);

// Projeye ait görev oluşturma (URL /api/projects/:projectId/tasks olduğu için buraya koyduk)
router.post('/:projectId/tasks', taskController.createTask);

module.exports = router;