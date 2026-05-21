const { z } = require('zod');

const loginSchema = {
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),
};

module.exports = { loginSchema };
