const gulp = require('gulp');
const sitemap = require('./gulp/sitemap')
const postGig = require('./gulp/post-gig')

gulp.task('sitemap', sitemap);
gulp.task('post-gig', postGig);
