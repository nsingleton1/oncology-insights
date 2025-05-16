const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // This proxy is only used in development
  // In production, our Express server handles both API and static files
  if (process.env.NODE_ENV === 'development') {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    // Proxy all /api requests to the mock API server
    app.use(
      '/api',
      createProxyMiddleware({
        target: apiUrl,
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
  }
}; 