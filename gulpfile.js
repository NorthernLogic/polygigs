const gulp = require('gulp');
const sitemap = require('./gulp/sitemap');
const postGig = require('./gulp/post-gig');
const registerSubscribersToTopics = require('./gulp/notifications-register-subscribers');
const sendGigNotifications = require('./gulp/send-gig-notifications');

gulp.task('sitemap', sitemap);
gulp.task('post-gig', postGig);
gulp.task('notifications-register-subscribers', registerSubscribersToTopics);
gulp.task('send-gig-notifications', sendGigNotifications);
