
/*
 * GET routing listing.
 */

exports.knov = function(req, res){
  res.render('projects/knov', { title: 'Knov' });
};

// Generic routing
exports.project = function(req, res) {

    var name = req.params.name;

    res.render('projects/'+name, {
        title: name
    })
}