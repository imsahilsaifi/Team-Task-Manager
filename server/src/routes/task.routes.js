const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');
const { validate } = require('../middleware/validate.middleware');

router.use(authenticate);

router.get('/', requireRole(), getTasks);
router.post('/', requireRole(), createTaskValidator, validate, createTask);
router.put('/:taskId', requireRole(), updateTaskValidator, validate, updateTask);
router.delete('/:taskId', requireRole('ADMIN'), deleteTask);

module.exports = router;
