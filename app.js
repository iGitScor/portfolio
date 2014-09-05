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
  , sitemap         = require('express-sitemap') 
  , http            = require('http')
  , path            = require('path')
  , swig            = require('swig')
  , passport        = require('passport')
  , GitHubStrategy  = require('passport-github').Strategy
  , flash           = require('connect-flash')
  , fileSystem      = require('fs')
  , auth            = require('./auth.js');
  
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
    app.set('_scorProtocol', 'http');
    app.set('_scorURL', 'sebastien-correaud.herokuapp.com');
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
      // Allowed image extension handler
      var extensions = ["png", "jpg"];
      
      // If the requested url is an image url and the extension of the image allows the replacement
      if (!!~extensions.indexOf(req.originalUrl.substr(req.originalUrl.length - 3))) {
        var qcqImage = fileSystem.readFileSync('./public/img/error/404.png');
        res.type('png');
        res.end(qcqImage, 'binary');
      } else {
        // Continue to others error handling middlewares
        next();
      }
    });
     
    app.use(function(req, res, next){
      res.status(404);
    
      // Respond with HTML page
      if (req.accepts('html')) {
        res.render(
            'error/404.html',
            {
                title:'404: Resource not found', 
                error: "La page " + req.url + " que vous avez demandé n'a pas été trouvée.", 
                subTitle: "Erreur 404 : non trouvé",
                errorCode: '404'
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
                subTitle: "Erreur 500 : problème interne",
                errorCode: '500'
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
var GITHUB_CLIENT_ID      = "5c8e0612f515b1f08af8";
var GITHUB_CLIENT_SECRET  = "4ea20927bf2e6db11f2a8a4c2f639d7068175df1";

// Use the GitHubStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and GitHub
// profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: app.get('_scorProtocol') + "//" + app.get('_scorURL') + "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


/***************************************************** 
 ***                     Routing 
 *****************************************************/
app.get('/', routes.index);
app.get('/ma-personnalite', routing.personnalite);
app.get('/mon-reseau-social', routing.style);
app.get('/knov', routing.knov);
app.get('/projets/:name', routing.project);

app.get('/~scor', auth.ensureAuthenticated, function(req, res){
  res.render('private/index', { user: req.user });
});

app.get('/~scor/:name', auth.ensureAuthenticated, function(req, res){
  var name = req.params.name;
  res.render('private/' + name, { user: req.user });
});

app.get('/login', function(req, res){
  res.render('auth', { user: req.user, message: req.flash('error') });
});

// GET /auth/github
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in GitHub authentication will involve redirecting
// the user to github.com. After authorization, GitHub will redirect the user
// back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
});

// GET /auth/github/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/***************************************************** 
 ***                     Sitemap 
 *****************************************************/
sitemap({
    url: app.get('_scorURL'),
    map: {
        '/': ['get'],
        '/ma-personnalite': ['get','post'],
        '/mon-reseau-social': ['get'],
        '/projets/knov': ['get'],
        '/projets/js13k': ['get'],
    },
    route: {
        '/': {
            lastmod: '2014-09-05',
            changefreq: 'always',
            priority: 1.0,
        },
        '/ma-personnalite': {
            lastmod: '2014-08-28',
            changefreq: 'yearly',
            priority: 0.5,
        },
        '/mon-reseau-social': {
            lastmod: '2014-08-30',
            changefreq: 'yearly',
            priority: 0.9,
        },
    },
}).toFile();

app.get('/sitemap.xml',function(req,res) {
    res.set('Content-Type', 'text/xml');
    var content = fileSystem.readFileSync('./sitemap.xml');
    res.type('xml');
    res.end(content, 'text/xml');
});

app.get('/robot.txt',function(req,res) {
    var content = fileSystem.readFileSync('./robots.txt');
    res.type('txt').send(content);
});

/***************************************************** 
 ***                     Server 
 *****************************************************/
// Create NodeJS server instance.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});