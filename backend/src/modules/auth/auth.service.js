const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../config/database');
const { env } = require('../../config/env');
const { UnauthorizedError } = require('../../utils/errors');
const { logger } = require('../../utils/logger');

/**
 * Factory — allows dependency injection for testing.
 * Production code uses the default export (real prisma).
 */
function createAuthService(deps = {}) {
  const db = deps.prisma || prisma;
  const crypt = deps.bcrypt || bcrypt;
  const token = deps.jwt || jwt;
  const config = deps.env || env;
  const log = deps.logger || logger;

  async function login(email, password, meta = {}) {
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    const validPassword = await crypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    const jwtToken = token.sign(
      { userId: user.id, email: user.email, role: user.role, fullName: user.fullName },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'login',
        entityType: 'user',
        entityId: user.id,
        ipAddress: meta.ip || null,
        userAgent: meta.userAgent || null,
      },
    });

    log.info({ userId: user.id, email: user.email }, 'User logged in');

    return {
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async function getMe(userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    return user;
  }

  return { login, getMe };
}

// Default instance with real dependencies
const defaultService = createAuthService();

module.exports = { ...defaultService, createAuthService };
