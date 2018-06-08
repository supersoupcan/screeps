//Body: an object which assembles a particular form of Body
//  only used when building 

//argv[0] bodyRecipe = ARRAY (a template, with the ratios of non-MOVE parts 
//  this body contains, EX: [CARRY, WORK])

function Body(bodyRecipe){
  this.bodyRecipe = bodyRecipe;
}

Body.prototype = {
  build : function(power, isRoad){
    const movePartPerParts = isRoad ? 4 : 2;
    let body = [];
    let bodyEnergyCost = 0;
    let i = 0;
    let p = 0;

    let nextPart;

    while(bodyPart + BODYPART_COST[nextPart] < power){
      body.push(nextPart);
      if(i % movePartPerParts === 0){
        nextPart = MOVE;
      }else{
        nextPart = this.bodyRecipe[p] % this.bodyRecipe.length;
        p++;
      }
      i++;
    }

    return body;
  }
};

//Role: an object which describes the way a creep of a particular 
//  body compisition should be treated or exchanged
//  creeps are spawned as specific body types, 
//  and given jobs dynamically as need arrive

//argv[0] name = STRING (a ref to the role object exported from this module)
//argv[1] bodyRecipe = ARRAY ( explained above)
//argv[2] jobs = ARRAY (list which references the jobs this role may preform)

function Role(name, bodyRecipe, jobs){
  this.name = name;
  this.body = new Body(bodyRecipe);
}

const worker = new Role('worker', [CARRY, WORK]);

module.exports.worker = worker;