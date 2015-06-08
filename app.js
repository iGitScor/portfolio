/**
 * app.js
 * SCOR (iGitScor : http://github.com/iGitScor)
 *
 */


/*****************************************************
 ***                     Initialization
 *****************************************************/
// Module dependencies / imports
var express = require('express'),
  http = require('http'),
  path = require('path'),
  swig = require('swig'),
  fileSystem = require('fs'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  cookieSession = require('cookie-session'),
  passport = require('passport'),
  GitHubStrategy = require('passport-github').Strategy,
  routes = require('./routes'),
  routing = require('./routes/routing'),
  appSitemap = require('./scripts/sitemap'),
  mailer = require('./scripts/mailer'),
  auth = require('./scripts/auth'),
  i18n = require("i18next"),
  searchindex = require('search-index'),
  glossary = require("glossary");

// Instanciate express framework
var app = express();

// Define SWIG as the default template rendering
app.engine('html', swig.renderFile);

/*****************************************************
 ***                     Configuration
 *****************************************************/
// Internationalization configuration.
i18n.registerAppHelper(app);
i18n.init({
  lng: "fr",
  detectLngFromPath: 0,
  supportedLngs: ['fr', 'en'],
  resGetPath: 'content/i18n/__lng__/__ns__.json',
  useCookie: false,
  ns: {
    namespaces: ['translation', 'meta', 'routing', 'cv', 'pages'],
    defaultNs: 'translation'
  }
});

// simple logger
app.use(function(req, res, next){
  var urlParsed = req.url.split( '/' );
  if (urlParsed[1] === 'fr' || urlParsed[1] === 'en') {
    urlParsed.shift();
    urlParsed.shift();
    urlParsed = urlParsed.join('/');
    urlParsed = '/' + urlParsed;

    res.locals.requestedURL = urlParsed;
  }

  next();
});

// Common application configuration
app.set('port', 80);
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('_scorProtocol', 'http');
app.set('_scorURL', process.env.SITE || 'sebastien-correaud.herokuapp.com');
app.use(express.logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(i18n.handle);
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieSession({
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 604800000
}));
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));

/*
 * Cache-control on all resources
 */
app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "max-age=" + 604800000);
  next();
});

/*
 * Errors
 */
app.use(function(req, res, next) {
  // Allowed image extension handler
  var extensions = ["png", "jpg", "gif"];

  // If the requested url is an image url and the extension of the image allows the replacement
  if (!!~extensions.indexOf(req.originalUrl.substr(req.originalUrl.length - 3))) {
    var qcqImage = fileSystem.readFileSync('./public/img/error/not_found.png');
    res.status(404);
    res.type('png');
    res.end(qcqImage, 'binary');
  }
  else {
    // Continue to other errors handling middlewares
    next();
  }
});

app.use(function(req, res, next) {
  res.status(404);

  // Respond with HTML page
  if (req.accepts('html')) {
    res.render(
      'error/404.html', {
        title: i18n.t('error.page.qcq.title'),
        error: i18n.t('error.page.qcq.message', { url: req.url }),
        subTitle: i18n.t('error.page.qcq.subtitle'),
        errorCode: '404'
      }
    );

    return;
  }

  // Default to plain-text. send()
  res.type('txt').send('Not found');
});

app.use(function(error, req, res, next) {
  res.status(500);

  // Respond with html page
  if (req.accepts('html')) {
    res.render(
      'error/500.html', {
        title: i18n.t('error.page.cc.title'),
        error: error,
        subTitle: i18n.t('error.page.cc.subtitle'),
        errorCode: '500'
      }
    );

    return;
  }

  // Default to plain-text. send()
  res.type('txt').send('Not found');
});

/*****************************************************
 ***                     Security
 *****************************************************/
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Use the GitHubStrategy within Passport.
// Strategies in Passport require a `verify` function, which accept
// credentials (in this case, an accessToken, refreshToken, and GitHub
// profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: app.get('_scorProtocol') + "://" + app.get('_scorURL') + "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
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
var searchEngine = function(index, keywords, results, response) {
    if (index == keywords.length) {
        if (Object.keys(results).length) {
            return response.json(results);
        } else {
            return response.json({
                error: {
                    code: '__',
                    message: 'Aucun résultat'
                }
            });
        }
    }
};

/*** REST Routing ***/
app.get('/api/s/:searchText/:searchType/:lang', function(req, res){
    var searchType = (req.params.searchType == 'undefined') ? 'main' : req.params.searchType;
    var filters = ['metadata'];

    var batch = JSON.parse(fileSystem.readFileSync('./content/search/' + searchType + '/fr/search-index.json'));

    searchindex.empty(function(emptyError) {
        if (!emptyError) {
            searchindex.add({'batchName': searchType, 'filters': filters}, batch, function(addError) {
                if(!addError) {
                    var apiResults = {};
                    var search = decodeURIComponent(req.params.searchText.toLowerCase());
                    var keywords = glossary.extract(search);

                    if (keywords.length === 0) {
                       keywords = search.split(' ');
                    }
                    var indexor = 0;

                    keywords.forEach(function(entry) {
                        searchindex.match(entry, function(matchError, matches) {
                            if (!matchError && matches.length > 0) {
                                var query = {
                                    "query": {
                                        "metadata": matches
                                    }
                                };
                                searchindex.search(query, function(searchError, results) {
                                    if (!searchError) {
                                        if (results.totalHits) {
                                            results.hits.forEach(function(hit) {
                                                var resultIndex = new Buffer(JSON.stringify(hit.document)).toString('base64');
                                                apiResults[resultIndex] = {body:hit.document.body, link:hit.document.link };
                                            });
                                            indexor++;
                                            searchEngine(indexor, keywords, apiResults, res);
                                        } else {
                                          indexor++;
                                          searchEngine(indexor, keywords, apiResults, res);
                                        }
                                    } else {
                                      indexor++;
                                      searchEngine(indexor, keywords, apiResults, res);
                                    }
                                });
                            } else {
                              indexor++;
                              searchEngine(indexor, keywords, apiResults, res);
                            }
                        });
                    });
                    // Case no keyword
                    searchEngine(indexor, keywords, apiResults, res);
                }
            });
        }
    });
});

app.get('/api/f/red', function (req, res) {

    var FeedParser = require('feedparser')
      , request = require('request')
      , tplObj = Array()
      , atom = request('http://www.redbubble.com/people/iscor/portfolio/recent.atom')
      , feedparser = new FeedParser();

    atom.on('error', function (error) {
      // handle any request errors
    });

    atom.on('response', function (res) {
        var stream = this;

        if (res.statusCode != 200) {
            return this.emit('error', new Error('Bad status code'));
        }

        stream.pipe(feedparser);
    });

    feedparser.on('error', function (error) {
      // always handle errors
    });

    feedparser.on('readable', function () {
      // This is where the action is!
      var stream = this, item;

      while (item = stream.read()) {
        if (item.title && item.description && item.link) {
            tplObj.push({
                title: item.title,
                description: item.description,
                link: item.link
            });
        }
      }
    });

    feedparser.on('end', function () {
        return  res.json(tplObj);
    });
});

app.post('/api/a/engine/:context', auth.ensureAuthenticated, function(req, res){
    searchindex.empty(function(err) {
        if (!err) {
            var batchName = req.params.context;
            var filters = ['metadata'];
            var batch = JSON.parse(fileSystem.readFileSync('./content/search/' + batchName + '/fr/search-index.json'));

            searchindex.add({'batchName': batchName, 'filters': filters}, batch, function(err) {
                if (err) {
                    return res.json({error : 1});
                }
                return res.json({success : 1});
            });
        } else {
            return res.json({error : 1});
        }
    });
});

app.get('/api/a/system', auth.ensureAuthenticated, function(req, res){
    var engineFiles = fileSystem.readdirSync('./si');
    return res.json(engineFiles);
});

app.delete('/api/a/system/:path', auth.ensureAuthenticated, function(req, res){
    fileSystem.unlink('./si/' + req.params.path, function (err) {
        if (err) {
            return res.json({error : 1});
        }
        return res.json({success : 1});
    });
});

/*** HTTP Routing ***/
app.get('/', routes.index);
app.get('^(\/fr/ma-personnalite\/?|\/en/my-personality\/?)$', routing.personnalite);
app.get('^(\/fr/mon-reseau-social\/?|\/en/my-social-network\/?)$', routing.network);
app.get('/redbubble', routing.redbubble);
app.get('/knov', routing.knov);
app.get('/projets/:name', routing.project);

var area51 = process.env.AREA51 || '~admin';
app.get('/' + area51, auth.ensureAuthenticated, function(req, res) {
  res.render('admin/index', {
    user: req.user
  });
});

app.get('/' + area51 + '/:name', auth.ensureAuthenticated, function(req, res) {
  var name = req.params.name;
  res.render('admin/' + name, {
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('auth', {
    user: req.user,
    message: req.flash('error')
  });
});

// GET /auth/github
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in GitHub authentication will involve redirecting
// the user to github.com. After authorization, GitHub will redirect the user
// back to this application at /auth/github/callback
app.get('/auth/github', passport.authenticate('github'));

// GET /auth/github/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    if (req.user.username !== process.env.ADMIN_USERNAME) {
        req.logout();
        res.redirect('/fr');
    } else {
        var redirectingURL = req.session.privateURL ? req.session.privateURL : '/fr';
        delete req.session.privateURL;
        res.redirect(redirectingURL);
    }
  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/fr');
});

/*****************************************************
 ***                     Contact
 *****************************************************/
var allowedContactForms = ["formulaire-de-contact", "contact-form", "formulaire-embauche", "job-proposal-form"];
app.get('/:lang/contact/:type', function(req, res) {
  // Filter allowed type
  if (!!~allowedContactForms.indexOf(req.params.type)) {
    res.render('contact', {
      type: req.params.type,
      title: 'Contact'
    });
  }
  else {
    // Redirect to the homepage
    res.writeHead(302, {
      'Location': '/'
    });
    req.flash('information', i18n.t('error.form.404'));
    res.end();
  }
});

app.get('/:lang/contact/:type/email', auth.ensureAuthenticated, function(req, res) {
  res.render('emails/' + req.params.type);
});

app.post('/:lang/contact/:type', function(req, res) {
  // Filter allowed type to avoid bots attack
  if (!!~allowedContactForms.indexOf(req.params.type)) {
    res.render('contact', {
      name: req.param('name'),
      type: req.params.type,
      title: 'Contact'
    });

    var options = {
      type: req.params.type,
      message: req.param('msg'),
      name: req.param('name'),
    };
    mailer.sendMail(options);
  }
  else {
    // Redirect to the homepage
    res.status(403).send('403 - Forbidden');
  }
});

/*****************************************************
 ***                     Sitemap
 *****************************************************/
appSitemap.generateSitemap(app.get('_scorURL'));

app.get('/sitemap.xml', function(req, res) {
  res.set('Content-Type', 'text/xml');
  var content = fileSystem.readFileSync('./sitemap.xml');
  res.type('xml');
  res.end(content, 'text/xml');
});

app.get('/robots.txt', function(req, res) {
  var content = fileSystem.readFileSync('./robots.txt');
  res.type('txt').send(content);
});

/*****************************************************
 ***                     Server
 *****************************************************/
// Default route, homepage for all languages
app.get("^(\/fr\/?|\/en\/?)$", routes.index);

// Create NodeJS server instance.
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});