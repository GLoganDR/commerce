'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Item(o){
  this.name           = o.name;
  this.dimensions     = {};
  this.dimensions.l   = parseFloat(o.dimensions.l);
  this.dimensions.w   = parseFloat(o.dimensions.w);
  this.dimensions.h   = parseFloat(o.dimensions.h);
  this.weight         = parseFloat(o.weight);
  this.color          = o.color;
  this.quantity       = o.quantity * 1;
  this.msrp           = parseFloat(o.msrp);
  this.percentOff     = parseFloat(o.percentOff);
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.prototype.cost = function(){
  return parseFloat(this.msrp - (this.msrp * (this.percentOff/100)));
};

Item.prototype.save = function(cb){
  Item.collection.save(this, cb);
};

Item.all = function(cb){
  Item.collection.find().toArray(function(err, objects){
    var items = objects.map(function(o){
      return changePrototype(o);
    });

    cb(items);
  });
};

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Item.collection.findOne({_id:_id}, function(err, obj){
    var item = changePrototype(obj);

    cb(item);
  });
};

Item.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Item.collection.findAndRemove({_id:_id}, cb);
};

module.exports = Item;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  var item = _.create(Item.prototype, obj);
  return item;
}
