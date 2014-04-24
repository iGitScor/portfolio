
/*
 * GET routing listing.
 */

// Shorten URLs
// URL [HOST]/knov
exports.knov = function(req, res){
  res.render('projects/knov', { title: 'Knov' });
};

// Generic routing
// URL [HOST]/projects/{name}
exports.project = function(req, res) {

    var name = req.params.name;

    res.render('projects/'+name, {
        title: name
    })
}

exports.private = function(req, res) {
    res.render('private/index', {title: 'Private'});
}

exports.auth = function(req, res) {
    res.render('private/auth', {title: 'Private'});
}