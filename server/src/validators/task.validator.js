const { body } = require('express-validator');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
  body('assigneeId').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
  body('assigneeId').optional(),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = { createTaskValidator, updateTaskValidator };
