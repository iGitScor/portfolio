/**
 * index.js
 * GET main route.
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */

var compressor = require('node-minify'),
fs = require("fs");

exports.index = function(req, res){
    if (!fs.existsSync('public/js/dist/index-min-gcc.js')) {
        fs.writeFileSync('public/js/dist/index-min-gcc.js', '');
    }
    
    fs.stat('public/js/dist/index-min-gcc.js', function(err, stats) {
        var dInterval;
        if (stats.size > 0) {
            var now = new Date();
            var mTime = new Date(stats.mtime);
        
            var interval = Math.abs(now.getTime() - mTime.getTime());
            dInterval = interval / (1000 * 3600 * 24);
        } else {
            dInterval = -1;
        }
        
        // One week cache
        if (dInterval > 7 || dInterval == -1) {
            // Using Google Closure
            new compressor.minify({
                type: 'gcc',
                publicFolder: 'public/js/',
                fileIn: ['external/jquery-2.1.0.min.js', 'session-1.0.min.js', 'external/owl.carousel.min.js', 'animation-1.0.min.js'],
                fileOut: 'public/js/dist/index-min-gcc.js',
                callback: function(err, min){
                    console.log(err);
                }
            });
        }
    });
    
    if (!fs.existsSync('public/css/index-min-yui.css')) {
        fs.writeFileSync('public/css/index-min-yui.css', '');
    }
    
    fs.stat('public/css/index-min-yui.css', function(err, stats) {
        var dInterval;
        if (stats.size > 0) {
            var now = new Date();
            var mTime = new Date(stats.mtime);
        
            var interval = Math.abs(now.getTime() - mTime.getTime());
            dInterval = interval / (1000 * 3600 * 24);
        } else {
            dInterval = -1;
        }
        
        // One week cache
        if (dInterval > 7 || dInterval == -1) {
            // Using YUI Compressor for CSS
            new compressor.minify({
                type: 'yui-css',
                publicFolder: 'public/css/',
                fileIn: ['style-1.0.min.css', 'layout-1.0.min.css', 'hint.css', 'badge-1.0.min.css', 'pages/cv.presentation.css', 'external/owl.carousel.css', 'animation-1.0.min.css', 'sprite.flags-1.0.min.css'],
                fileOut: 'public/css/index-min-yui.css',
                callback: function(err, min){
                    console.log(err);
                }
            });
        }
    });
    
    res.render(
        'index', 
        { 
            title: 'Curriculum vitae', 
            message: req.flash('information'),
            scripts: '/js/dist/index-min-gcc.js',
            styles: '/css/index-min-yui.css'
        }
    );
};