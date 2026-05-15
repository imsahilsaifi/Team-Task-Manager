const prisma = require('../lib/prisma');

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;
      const userId = req.user.userId;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          members: {
            where: { userId },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const membership = project.members[0];

      if (!membership) {
        return res.status(403).json({ error: 'Not a member of this project' });
      }

      if (roles.length > 0 && !roles.includes(membership.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.userRole = membership.role;
      req.project = project;
      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = { requireRole };
