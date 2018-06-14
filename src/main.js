'use strict'
require('extendPrototypes');

const lifecycle = require('lifecycle');

module.exports.loop = function(){
  lifecycle.run();
}