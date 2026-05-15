const { body } = require('express-validator');

const createProjectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
];

const updateProjectValidator = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('description').optional().trim(),
];

const addMemberValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MEMBER'])
    .withMessage('Role must be ADMIN or MEMBER'),
];

module.exports = { createProjectValidator, updateProjectValidator, addMemberValidator };
