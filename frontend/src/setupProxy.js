const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Only use proxy in development
  if (process.env.NODE_ENV === 'development') {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    
    app.use(
      '/api',
      createProxyMiddleware({
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        onProxyReq: function(proxyReq, req, res) {
          // Log proxy requests for debugging
          console.log(`🔄 Proxying ${req.method} ${req.url} to backend at ${backendUrl}`);
        },
        onError: function(err, req, res) {
          console.error('❌ Proxy error:', err.message);
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('Proxy error: ' + err.message);
        }
      })
    );
  }
}; 