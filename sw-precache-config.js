module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    'bower_components/raven-js/dist/raven.min.js',
    'bower_components/raven-js/dist/raven.min.js.map',
    'src/firebase-messaging-sw.js',
    '/**/*.png',
  ],
  importScripts: [
    'src/firebase-messaging-sw.js',
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/]
}