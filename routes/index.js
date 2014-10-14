/**
 * index.js
 * GET main route.
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */

var compressor = require('node-minify'),
    fs = require("fs"),
    i18n = require("i18next");

exports.index = function(req, res) {
    var compiledJSPath = '/js/dist-index-min-gcc.js',
        compiledCSSPath = '/css/dist-index-min-yui.css';

    if (!fs.existsSync('public' + compiledJSPath)) {
        fs.writeFileSync('public' + compiledJSPath, '');
    }

    fs.stat('public' + compiledJSPath, function(err, stats) {
        var dInterval;
        if (stats.size > 0) {
            var now = new Date();
            var mTime = new Date(stats.mtime);

            var interval = Math.abs(now.getTime() - mTime.getTime());
            dInterval = interval / (1000 * 3600 * 24);
        }
        else {
            dInterval = -1;
        }

        // One week cache
        if (dInterval > 7 || dInterval == -1) {
            // Using Google Closure
            new compressor.minify({
                type: 'gcc',
                publicFolder: 'public/js/',
                fileIn: ['external/jquery-2.1.0.min.js', 'sources/share-1.0.js', 'sources/menu-1.0.js', 'sources/session-1.0.js', 'external/owl.carousel.min.js', 'sources/animation-1.0.js'],
                fileOut: 'public' + compiledJSPath,
                callback: function(err, min) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("GO GO GO GO GO");
                    }
                }
            });
        }
    });

    if (!fs.existsSync('public' + compiledCSSPath)) {
        fs.writeFileSync('public' + compiledCSSPath, '');
    }

    fs.stat('public' + compiledCSSPath, function(err, stats) {
        var dInterval;
        if (stats.size > 0) {
            var now = new Date();
            var mTime = new Date(stats.mtime);

            var interval = Math.abs(now.getTime() - mTime.getTime());
            dInterval = interval / (1000 * 3600 * 24);
        }
        else {
            dInterval = -1;
        }

        // One week cache
        if (dInterval > 7 || dInterval == -1) {
            // Using YUI Compressor for CSS
            new compressor.minify({
                type: 'yui-css',
                publicFolder: 'public/css/',
                fileIn: ['style-1.0.min.css', 'layout-1.0.min.css', 'hint.css', 'badge-1.0.min.css', 'pages/cv.presentation.css', 'external/owl.carousel.css', 'animation-1.0.min.css', 'sprite.flags-1.0.min.css'],
                fileOut: 'public' + compiledCSSPath,
                callback: function(err, min) {
                    if (err) {
                        console.error(err);
                    }
                }
            });
        }
    });

    res.render(
        'index', {
            title: 'Curriculum vitae',
            message: req.flash('information'),
            scripts: compiledJSPath,
            styles: compiledCSSPath,
            meta_description: i18n.t("meta:description.home"),
            query: req.query
        }
    );
};