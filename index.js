/*global require, __dirname */
'use strict';
// Import required modules
var express = require('express')
//    stormpath = require('express-stormpath')
    , swig  = require('swig')
    , compress = require('compression')
    //$ = require('jquery');
    , app = express();
    app.use(compress());   
var css = ['css/main.css'],
    js = ['node_modules/jquery/dist/jquery.js',
        'js/barekit.min.js',
        'js/bundle.js'],
    title = 'Performant Design';
if ('production' == app.get('env')) {
  css = ['assets/bundle.min.css'],
  js = ['assets/bundle.min.js'];

//  // Configure Stormpath.
//  app.use(stormpath.init(app, {
//    application: process.env.STORMPATH_URL
//  }));
//
//  // Generate a simple dashboard page.
//  app.get('/dashboard', stormpath.loginRequired, function(req, res) {
//    res.send('Hi: ' + req.user.email + '. Logout <a href="/logout">here</a>');
//  });
}

app.get('/', function(req, res) {
  if ('production' == app.get('env')) {
      res.sendFile(__dirname +'/index.prod.html');
  } else {
      var template = swig.compileFile(__dirname + '/index.dev.html');
      var output = template({
          css: css,
          title: title,
          js: js
      });
      res.send(output);
  }
});

app.get(/^(.+)$/, function(req, res) {
  if ('production' == app.get('env')) {
    res.setHeader("Cache-Control", "public, max-age=2419200"); // 14 days
    res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());
  }
  res.sendFile(__dirname +'/' + req.params[0]); 
});

// Listen for incoming requests and serve them.
app.listen(process.env.PORT || 3000);
