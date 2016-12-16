module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    'bower_components/raven-js/dist/raven.min.js',
    'bower_components/raven-js/dist/raven.min.js.map',
    '/**/*.png',
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/]
}