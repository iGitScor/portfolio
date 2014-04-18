/**
 * app.js
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */
 
 
/***************************************************** 
 ***                     Initialization 
 *****************************************************/
 // Module dependencies
var express     = require('express')
  , routes      = require('./routes')
  , routing     = require('./routes/routing')
  , http        = require('http')
  , path        = require('path')
  , swig        = require('swig');

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
    app.use(express.bodyParser());
    app.use(express.methodOverride());
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

      // respond with html page
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

      // default to plain-text. send()
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
 ***                     Routing 
 *****************************************************/
app.get('/', routes.index);
app.get('/knov', routing.knov);
app.get('/projects/:name', routing.project);

/***************************************************** 
 ***                     Server 
 *****************************************************/
// Create NodeJS server instance.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});