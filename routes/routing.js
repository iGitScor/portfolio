/**
 * routing.js
 * GET routing listing.
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */
 
var i18n = require('i18next');

exports.personnalite = function(req, res) {
    res.render('cv/extended/personnalite', {
        title: i18n.t('routing:urls.personality.title')
    });
};

exports.network = function(req, res) {
    res.render('network', {
        title: i18n.t('routing:urls.network.title')
    });
};

// Shorten URLs
// URL [HOST]/knov
exports.knov = function(req, res) {
    res.render('projects/knov', {
        title: 'Knov'
    });
};

// Generic routing
// URL [HOST]/projects/{name}
exports.project = function(req, res) {
    var name = req.params.name;

    res.render('projects/' + name, {
        title: name
    });
};