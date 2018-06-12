const job = require('job');

const Goal = function(name, job, priority, config){
  this.name = name;
  this.job = job;
  this.priority = priority;
  this.argvs = config.argvs || [];
  this.maximum = config.maximum || 100;
}

Goal.prototype = function(){
  function init(room){

    /*Add override later
    //let override = {};
    //if(overrideArgsArr){
      //override = this.override.apply(this, overrideArgsArr);
    //}

    const uniqueId = _.uniqueId(this.name + '_');
    room.memory.goal[uniqueId] = Object.assign({
      goal : this.name,
      argvs : this.argvs,
      assigned : [],
    })
    */
  }

  function onCompletion(){
    //Something;  
  }

  return ({
    init : init,
  })
}();


const maintainEnergy = new Goal(
  'maintain_energy',
  job.harvester,
  function(room){
    return 5;
  },{}
)

const maintainController = new Goal(
  'maintain_controller',
  job.upgrader,
  function(room){
    return 5;
  },{
    maximum : 1
  }
)

const upgradeController = new Goal(
  'upgrade_controller',
  job.upgrader,
)

let BuildConstructionSites = function(structureType, basePriority){
  Goal.call(
    this, 
    'builder_' + structureType,
    new job.Builder(structureType),
    function(room){
      return basePriority;
    },
  )
}

//upgrade controller has a low priority, 
//to ensure that other jobs are done first

module.exports = {
  maintain_energy : maintainEnergy,
  maintain_controller : maintainController,
  upgrade_controller : upgradeController,
  BuildConstructionSites : BuildConstructionSites,
}

/*

const upgradeController = new Goal(
  'upgradeController',
  job.upgrader,
  function(room){
    return 5;
  },
  {
    maximum : 1
  }
)

const buildSite = new Goal(
  'buildSite',
  job.builder,
  function(room){
    return 5;
  },
  {
    override : function(buildSiteId){
      return({
        workSiteId : buildSiteId,
      })
    }
  }
)
*/

// A Priority takes in the current room of the goal, and runs an equation to see
// how important a given goal is at any point.