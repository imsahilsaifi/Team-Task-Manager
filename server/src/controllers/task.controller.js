const prisma = require('../lib/prisma');

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assigneeId, priority } = req.query;

    const where = { projectId };
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const { title, description, status, priority, assigneeId, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'To Do',
        priority: priority || 'Medium',
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        creatorId: userId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = req.user.userId;
    const userRole = req.userRole;

    const task = await prisma.task.findFirst({
      where: { id: taskId, projectId },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Members can only update status of their own assigned tasks
    if (userRole === 'MEMBER') {
      if (task.assigneeId !== userId) {
        return res.status(403).json({ error: 'You can only update tasks assigned to you' });
      }
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      const updated = await prisma.task.update({
        where: { id: taskId },
        data: { status },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true, email: true } },
        },
      });
      return res.json({ task: updated });
    }

    // ADMIN can update all fields
    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ task: updated });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await prisma.task.findFirst({ where: { id: taskId, projectId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
