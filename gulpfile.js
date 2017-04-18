const gulp = require('gulp');
const sitemap = require('./gulp/sitemap');
const rss = require('./gulp/rss');
const postGig = require('./gulp/post-gig');
const registerSubscribersToTopics = require('./gulp/notifications-register-subscribers');

gulp.task('sitemap', sitemap);
gulp.task('rss', rss);
gulp.task('post-gig', postGig);
gulp.task('notifications-register-subscribers', registerSubscribersToTopics);
