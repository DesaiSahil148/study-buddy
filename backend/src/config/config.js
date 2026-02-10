require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api/v1',
    corsOrigin: process.env.CORS_ORIGIN || '*',
};
