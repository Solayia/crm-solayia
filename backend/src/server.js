const app = require('./app');
const { env } = require('./config/env');
const { logger } = require('./utils/logger');
const { prisma } = require('./config/database');

async function start() {
  try {
    // Test DB connection
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(env.port, () => {
      logger.info({ port: env.port, env: env.nodeEnv }, 'CRM Solayia API started');
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

start();
