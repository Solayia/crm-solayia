const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { prisma } = require('../../config/database');
    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'logout',
        entityType: 'user',
        entityId: req.user.userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, getMe, logout };
