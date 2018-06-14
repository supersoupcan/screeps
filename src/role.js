function Body(bodyRecipe){
  this.bodyRecipe = bodyRecipe;
}

Body.prototype = function(){
  function build(power, isRoad){
    const movePartPerParts = isRoad ? 4 : 2;
    let body = [];
    let bodyEnergyCost = 0;
    let i = 0;
    let p = 0;
    let nextPart = null;

    do{
      if(nextPart){
        body.push(nextPart);
        bodyEnergyCost += BODYPART_COST[nextPart];
      }

      if(i % movePartPerParts === 0){
        nextPart = MOVE;
      }else{
        nextPart = this.bodyRecipe[p % this.bodyRecipe.length];
        console.log(p);
        p++;
      }
      i++;
    }while(bodyEnergyCost + BODYPART_COST[nextPart] < power);

    return body;
  }

  return ({
    build : build
  })
}();

function Role(name, bodyRecipe, jobs){
  this.name = name;
  this.body = new Body(bodyRecipe);
}

const worker = new Role('worker', [CARRY, WORK]);

module.exports.worker = worker;

/*
    while(bodyEnergyCost + BODYPART_COST[nextPart] < power){
      body.push(nextPart);
      bodyEnergyCost += BODYPART_COST[nextPart];


    }

    return body;


if(i % movePartPerParts === isRoad){
  nextPart = MOVE;
}else{
  nextPart = this.bodyRecipe[p % this.bodyRecipe.length]; 
  p++;
}
i++;

*/