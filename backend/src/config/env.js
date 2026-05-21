const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,

  urls: {
    publicBase: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
    landingBase: process.env.LANDING_BASE_URL || 'https://solayia.fr',
  },

  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'changeme123',
};

// Validation
if (!env.jwt.secret && env.nodeEnv === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

// Default secret for development only
if (!env.jwt.secret) {
  env.jwt.secret = 'dev-secret-do-not-use-in-production';
}

module.exports = { env };
