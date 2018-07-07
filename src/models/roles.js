const Role = function(name, body){
  this.name = name;
  this.body = {
      
    moveRatio : body.moveRatio || 2,
    repeat : body.repeat || [CARRY, WORK],
  }
}

Role.prototype = function(){
  function create(maxEnergy, isRoad){
    const movePartsPerOtherPart = isRoad ? this.body.moveRatio*2 : this.body.moveRatio;
    let body = [];
    let energyCost = 0;
    let i = 0;
    let p = 0;
    let nextPart = null;

    do{
      if(nextPart){
        body.push(nextPart);
        energyCost += BODYPART_COST[nextPart];
      }

      if(i % movePartsPerOtherPart === 0){
        nextPart = MOVE;
      }else{
        nextPart = this.body.repeat[p % this.body.repeat.length];
        p++;
      }
      i++;
    }while(energyCost + BODYPART_COST[nextPart] < maxEnergy);

    return ({
      role : this.name,
      body : body,
      energyCost : energyCost,
    })
  }

  return {
    create : create,
  }
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