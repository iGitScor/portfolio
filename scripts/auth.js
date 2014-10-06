/**
 * auth.js
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */
 
 
/***************************************************** 
 ***                     Initialization 
 *****************************************************/
 // Module dependencies
var passport = require('passport');

/*
// Temporary plug.
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];
*/

/***************************************************** 
 ***        Module public methods 
 *****************************************************/
/*
module.exports.findById = function (id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

// Private accessor
var findById = module.exports.findById;

module.exports.findByUsername = function (username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}
*/

module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.redirect('/login');
};


/***************************************************** 
 ***        Dependance calls 
 *****************************************************/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});