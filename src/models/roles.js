const Role = function(name, priority, body){
  this.name = name;
  this.priority = priority;
  this.body = body;
}

Role.prototype = function(){



  const public = {}
  
  return Object.assign({}, public);
}();

const worker = new Role('worker', {
  repeat : [CARRY, WORK],
})

const miner = new Role('miner', {
  repeat : [WORK]
})

const hauler = new Role('hauler', {
  repeat : [WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
})

module.exports = {
  worker : worker,
  miner : miner,
  hauler : hauler
}

/*
  Role refers to the part compisition of a creep body. Having a certain role means you have a 
  fixed priority to be assigend to certain room goals when needed.

   Workers
    workers have balanced CARRY and WORK components. Due to there ability to do everyting, they
    are the core role of the early game. Later, they perform better at upgrading, and repairing, 
    but will largely be phased out for more specialized creeps.

  Haulers
    haulers have a 5 to 1 ratio of CARRY to WORK components.This means they excel at building, and moving resources around.

  Miners
    miners have almost entirely WORK components. The drop mine source or materials and typically
    do not move or change roles after reaching there destination. Due to their relitively dedicated behaviour, miners
    population is maintained in a much more top-down manner then other roles.
*/