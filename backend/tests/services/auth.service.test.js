import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build mock dependencies — no module mocking needed
function createMocks() {
  const prisma = {
    user: { findUnique: vi.fn(), update: vi.fn() },
    auditLog: { create: vi.fn() },
  };
  const bcrypt = { compare: vi.fn() };
  const jwt = { sign: vi.fn(() => 'test-jwt-token') };
  const env = { jwt: { secret: 'test-secret', expiresIn: '7d' } };
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  return { prisma, bcrypt, jwt, env, logger };
}

// Import only the factory (no Prisma loaded)
const { createAuthService } = await import('../../src/modules/auth/auth.service.js');

describe('Auth Service', () => {
  let mocks;
  let authService;

  beforeEach(() => {
    mocks = createMocks();
    authService = createAuthService(mocks);
  });

  it('should reject login with unknown email', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.login('unknown@test.com', 'password'))
      .rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('should reject login with wrong password', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'test-id', email: 'test@test.com', passwordHash: 'hashed',
      fullName: 'Test', role: 'ADMIN', isActive: true,
    });
    mocks.bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login('test@test.com', 'wrong'))
      .rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('should reject login for inactive user', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'test-id', email: 'test@test.com', passwordHash: 'hashed',
      fullName: 'Test', role: 'ADMIN', isActive: false,
    });

    await expect(authService.login('test@test.com', 'password'))
      .rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('should return token and user on successful login', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'test-id', email: 'dolie@solayia.fr', passwordHash: 'hashed',
      fullName: 'Dolié', role: 'ADMIN', isActive: true,
    });
    mocks.bcrypt.compare.mockResolvedValue(true);
    mocks.prisma.user.update.mockResolvedValue({});
    mocks.prisma.auditLog.create.mockResolvedValue({});

    const result = await authService.login('dolie@solayia.fr', 'password');

    expect(result).toHaveProperty('token', 'test-jwt-token');
    expect(result.user.email).toBe('dolie@solayia.fr');
    expect(result.user.role).toBe('ADMIN');
    expect(result.user.fullName).toBe('Dolié');
  });

  it('should call bcrypt.compare with correct arguments', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'test-id', email: 'dolie@solayia.fr', passwordHash: 'the-hash',
      fullName: 'Dolié', role: 'ADMIN', isActive: true,
    });
    mocks.bcrypt.compare.mockResolvedValue(true);
    mocks.prisma.user.update.mockResolvedValue({});
    mocks.prisma.auditLog.create.mockResolvedValue({});

    await authService.login('dolie@solayia.fr', 'mypassword');

    expect(mocks.bcrypt.compare).toHaveBeenCalledWith('mypassword', 'the-hash');
  });

  it('should create audit log on successful login', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'user-123', email: 'dolie@solayia.fr', passwordHash: 'hashed',
      fullName: 'Dolié', role: 'ADMIN', isActive: true,
    });
    mocks.bcrypt.compare.mockResolvedValue(true);
    mocks.prisma.user.update.mockResolvedValue({});
    mocks.prisma.auditLog.create.mockResolvedValue({});

    await authService.login('dolie@solayia.fr', 'password', { ip: '127.0.0.1' });

    expect(mocks.prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-123',
        action: 'login',
        entityType: 'user',
        ipAddress: '127.0.0.1',
      }),
    });
  });

  it('should update lastLoginAt on successful login', async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({
      id: 'user-123', email: 'dolie@solayia.fr', passwordHash: 'hashed',
      fullName: 'Dolié', role: 'ADMIN', isActive: true,
    });
    mocks.bcrypt.compare.mockResolvedValue(true);
    mocks.prisma.user.update.mockResolvedValue({});
    mocks.prisma.auditLog.create.mockResolvedValue({});

    await authService.login('dolie@solayia.fr', 'password');

    expect(mocks.prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { lastLoginAt: expect.any(Date) },
    });
  });
});
