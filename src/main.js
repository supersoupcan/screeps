require('extend');
const lifecycle = require('lifecycle');

module.exports.loop = function(){
  lifecycle.main();
}