function Role(name, bodyRecipe){
  this.name = name;
  this.bodyRecipe = bodyRecipe;
}

Role.prototype = function(){
  function createBuild(maxEnergy, isRoad){
    const movePartPerParts = isRoad ? 4 : 2;
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

const worker = new Role('worker', [CARRY, WORK]);

module.exports.worker = worker;