/**
 * index.js
 * GET main route.
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */

exports.index = function(req, res){
    res.render(
        'index', 
        { 
            title: 'Curriculum vitae', 
            message: req.flash('information') 
        }
    );
};