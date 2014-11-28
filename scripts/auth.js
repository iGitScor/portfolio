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

module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  req.session.privateURL = req.url;
  res.redirect('/auth/github');
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