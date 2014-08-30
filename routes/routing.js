
/*
 * GET routing listing.
 */

// Shorten URLs
// URL [HOST]/knov
exports.knov = function(req, res){
  res.render('projects/knov', { title: 'Knov' });
};

exports.personnalite = function(req, res){
  res.render('cv/extended/personnalite', { title: 'Ma personnalité' });
};

// Generic routing
// URL [HOST]/projects/{name}
exports.project = function(req, res) {

    var name = req.params.name;

    res.render('projects/'+name, {
        title: name
    })
};

exports.private = function(req, res) {
    res.render('private/index', {title: 'Private'});
};

exports.auth = function(req, res) {
    res.render('private/auth', {title: 'Private'});
};

exports.style = function(req, res) {
    res.render('network', {title: 'Mon réseau'});
};