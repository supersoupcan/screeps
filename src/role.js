function Role(name, bodyRecipe, moveRatio){
  this.name = name;
  this.bodyRecipe = bodyRecipe;
  this.moveRatio = moveRatio;
}

Role.prototype = function(){
  function createBuild(maxEnergy, isRoad){
    const movePartPerParts = isRoad ? this.moveRatio*2 : this.moveRatio;
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

      if(i % movePartPerParts === 0){
        nextPart = MOVE;
      }else{
        nextPart = this.bodyRecipe[p % this.bodyRecipe.length];
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

  return ({
    createBuild : createBuild,
  })
}();

const worker = new Role('worker', [CARRY, WORK], 2);
const miner = new Role('miner', [WORK], 4);
const hauler = new Role('builder', [WORK, CARRY, CARRY, CARRY, CARRY, CARRY], 2)

module.exports = {
  worker : worker,
  miner : miner,
  hauler : hauler,
}

/*
// ROLES
// ~~~~~~
// worker: upgrades controller, maintains controller, repair, (everything at low RLC)
// miner: mines target standing ontop of container, repairs container when target is empty, 
// hauler: distributes resources, builds structures,
*/