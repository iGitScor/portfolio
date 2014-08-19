/**
 * app.js
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */
 
 
/***************************************************** 
 ***                     Initialization 
 *****************************************************/
 // Module dependencies / imports
var express         = require('express')
  , routes          = require('./routes')
  , routing         = require('./routes/routing')
  , http            = require('http')
  , path            = require('path')
  , swig            = require('swig')
  , passport        = require('passport')
  , GoogleStrategy  = require('passport-google').Strategy
  , flash           = require('connect-flash')
  , auth            = require('./auth.js');;
  
// Instanciate express framework
var app = express();

// Define SWIG as the default template rendering
app.engine('html', swig.renderFile);

/***************************************************** 
 ***                     Configuration 
 *****************************************************/
// Default configuration.
app.configure(function(){
    // Common application configuration 
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  
    /*
     * Errors
     */
    app.use(function(req, res, next){
      res.status(404);
    
      // Respond with HTML page
      if (req.accepts('html')) {
        res.render(
            'error/404.html',
            {
                title:'404: Resource not found', 
                error: "La page " + req.url + " que vous avez demandé n'a pas été trouvée.", 
                subTitle: "Erreur 404 : non trouvé"
            }
        );
        
        return;
      }

      // Default to plain-text. send()
      res.type('txt').send('Not found');
    });
    
    app.use(function(error, req, res, next){
      res.status(500);

      // Respond with html page
      if (req.accepts('html')) {
        res.render(
            'error/500.html', 
            {
                title:'500: Internal problem', 
                error: error, 
                subTitle: "Erreur 500 : problème interne"
            }
        );
        
        return;
      }

      // Default to plain-text. send()
      res.type('txt').send('Not found');
    });
  
});

// Development-only configuration
app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('view cache', false);
  swig.setDefaults({ cache: false });
});

/***************************************************** 
 ***                     Security 
 *****************************************************/
passport.use(new GoogleStrategy({
    returnURL: require('os').hostname()+'/auth/google/return',
    realm: require('os').hostname()
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));


/***************************************************** 
 ***                     Routing 
 *****************************************************/
app.get('/', routes.index);
app.get('/ma-personnalite', routing.personnalite);
app.get('/knov', routing.knov);
app.get('/projects/:name', routing.project);

app.get('/~scor', auth.ensureAuthenticated, function(req, res){
  res.render('private/index', { user: req.user });
});

app.get('/~scor/:name', auth.ensureAuthenticated, function(req, res){
  var name = req.params.name;
  res.render('private/'+name, { user: req.user });
});

app.get('/auth', function(req, res){
  res.render('auth', { user: req.user, message: req.flash('error') });
});

app.get('/auth/google', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);
  
app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/***************************************************** 
 ***                     Server 
 *****************************************************/
// Create NodeJS server instance.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});