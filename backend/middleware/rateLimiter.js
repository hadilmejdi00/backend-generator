const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requêtes par IP
  message: {
    error: 'Trop de requêtes, réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generatorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // maximum 10 générations par minute
  message: {
    error: 'Trop de générations, réessayez dans 1 minute.'
  }
});

module.exports = { limiter, generatorLimiter };