const { PrismaClient } = require('@prisma/client');

let _prisma;

function getPrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }
  return _prisma;
}

// Lazy getter — PrismaClient is only instantiated on first access
module.exports = {
  get prisma() {
    return getPrisma();
  },
};
