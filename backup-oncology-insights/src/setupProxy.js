const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to target
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({
          error: 'Proxy Error',
          message: 'Could not connect to API server. Is the mock-api running?',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
      },
      logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    })
  );
}; 