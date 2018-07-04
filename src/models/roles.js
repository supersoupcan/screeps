const Role = function(name, body){
  this.name = name;
  this.body = body;
}

Role.prototype = function(){
  function init(){
    return {
      amount : 0,
    }
  }

  const public = {
    init : init
  }
  
  return Object.assign({}, public);
}();

const worker = new Role('worker', {
  repeat : [CARRY, WORK],
})

module.exports = {
  worker : worker,
}
