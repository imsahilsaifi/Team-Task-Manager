const prisma = require('../lib/prisma');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all projects the user is part of
    const userMemberships = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    });
    const projectIds = userMemberships.map(m => m.projectId);
    const projectCount = projectIds.length;

    // Task counts across all user's projects
    const [totalTasks, todoCount, inProgressCount, doneCount] = await Promise.all([
      prisma.task.count({ where: { projectId: { in: projectIds } } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'To Do' } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'In Progress' } }),
      prisma.task.count({ where: { projectId: { in: projectIds }, status: 'Done' } }),
    ]);

    // Overdue tasks assigned to user
    const overdueTasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { not: 'Done' },
        dueDate: { lt: new Date() },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    // Recent tasks assigned to user
    const recentTasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    // Admin-specific: tasks created by this user
    const myCreatedTasks = await prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get monthly activity (tasks created in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const tasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        createdAt: { gte: sixMonthsAgo }
      },
      select: { createdAt: true }
    });

    const monthlyActivity = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthlyActivity[monthNames[d.getMonth()]] = 0;
    }

    tasks.forEach(task => {
      const month = monthNames[new Date(task.createdAt).getMonth()];
      if (monthlyActivity[month] !== undefined) {
        monthlyActivity[month]++;
      }
    });

    const activityData = Object.keys(monthlyActivity).map(name => ({
      name,
      value: monthlyActivity[name]
    }));

    // Tasks per user (member breakdown)
    const tasksPerUserRaw = await prisma.task.groupBy({
      by: ['assigneeId'],
      where: { projectId: { in: projectIds }, assigneeId: { not: null } },
      _count: { _all: true },
    });

    // Get user names for the breakdown
    const memberIds = tasksPerUserRaw.map(t => t.assigneeId);
    const members = await prisma.user.findMany({
      where: { id: { in: memberIds } },
      select: { id: true, name: true }
    });

    const tasksPerUser = tasksPerUserRaw.map(t => ({
      name: members.find(m => m.id === t.assigneeId)?.name || 'Unknown',
      count: t._count._all
    })).sort((a, b) => b.count - a.count);

    // Member role check in projects
    const adminProjects = await prisma.projectMember.count({
      where: { userId, role: 'ADMIN' },
    });

    res.json({
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueTasks,
      recentTasks,
      myCreatedTasks,
      projectCount,
      adminProjectCount: adminProjects,
      activityData,
      tasksPerUser
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDashboard };
