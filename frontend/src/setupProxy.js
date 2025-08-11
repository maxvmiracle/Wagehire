const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        // Log proxy requests for debugging
        console.log(`🔄 Proxying ${req.method} ${req.url} to backend`);
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
}; 