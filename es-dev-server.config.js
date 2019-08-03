module.exports = {
  port: 8080,
  http2: false,
  watch: true,
  nodeResolve: true,
  compatibility: 'all',
  babel: true,
  appIndex: 'demo/index.html',
  open: true,
  moduleDirs: [
    'node_modules',
    'components',
    'configs',
    'utils',
  ],
  customMiddlewares: [
    function rewriteIndex(ctx, next) {
      if (ctx.url === '/' || ctx.url === '/index.html') {
        ctx.url = '/components/calendar-element/demo';
      }

      return next();
    },
  ],
}
