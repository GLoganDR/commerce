'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
// a part to allow usage of the new delete verb.
var methodOverride = require('express-method-override');
var home = require('../controllers/home');
var items = require('../controllers/items');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  //sets it to be a usable function.
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);

  app.get('/items/new', items.init);
  app.post('/items', items.create);
  app.get('/items', items.index);
  app.get('/items/:id', items.show);
  //new and better way to delete using the correct verb.
  //also had to get rid of '/delete' from the end of '/items/:id'
  app.delete('/items/:id', items.destroy); 

  console.log('Pipeline Configured');
};

