/**
 * This file configures the development proxy for local development
 * and ensures API requests work properly in both development and production.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // If we need to proxy API requests to a backend server
  // Uncomment and configure this section
  /*
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'https://api.oncology-domain.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when making requests to the backend
      },
    })
  );
  */
}; 