
/**
 * Module dependencies.
 */

var express     = require('express')
  , routes      = require('./routes')
  , routing     = require('./routes/routing')
  , http        = require('http')
  , path        = require('path')
  , swig        = require('swig');

var app = express();

app.engine('html', swig.renderFile);

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('view cache', false);
  swig.setDefaults({ cache: false });
});

/** 
 * Routing 
 */
app.get('/', routes.index);
app.get('/knov', routing.knov);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
