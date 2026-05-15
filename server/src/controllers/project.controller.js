const prisma = require('../lib/prisma');

const getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        members: { some: { userId } }
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Attach user's role to each project
    const projectsWithRole = projects.map((p) => {
      const membership = p.members.find((m) => m.userId === userId);
      const userRole = membership ? membership.role : 'MEMBER';
      return { ...p, userRole };
    });

    res.json({ projects: projectsWithRole });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, description } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      const p = await tx.project.create({
        data: { name, description },
      });
      await tx.projectMember.create({
        data: { userId, projectId: p.id, role: 'ADMIN' },
      });
      return p;
    });

    const full = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } },
      },
    });

    res.status(201).json({ project: { ...full, userRole: 'ADMIN' } });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const m = project.members.find((m) => m.userId === userId);
    const userRole = m ? m.role : 'MEMBER';

    res.json({ project: { ...project, userRole } });
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: { name, description },
    });

    res.json({ project });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = 'MEMBER' } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existing = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId: id } },
    });
    if (existing) return res.status(409).json({ error: 'Already a member' });

    const member = await prisma.projectMember.create({
      data: { userId: user.id, projectId: id, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ member });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Cannot remove sole admin
    const admins = await prisma.projectMember.findMany({
      where: { projectId: id, role: 'ADMIN' },
    });
    const targetMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId: id } },
    });

    if (!targetMember) return res.status(404).json({ error: 'Member not found' });

    if (targetMember.role === 'ADMIN' && admins.length === 1) {
      return res.status(400).json({ error: 'Cannot remove the sole admin' });
    }

    await prisma.projectMember.delete({
      where: { userId_projectId: { userId, projectId: id } },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
