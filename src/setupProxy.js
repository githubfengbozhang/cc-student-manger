const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target: 'http://121.196.200.183/api',
    changeOrigin: true,
    pathRewrite: {
      "^/api": ""
    }
  }))
}
