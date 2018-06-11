const Goal = function(name, job, proirity, config){
  this.name = name;
  this.job = job;
  this.priority = priority;
  this.override = config.override || function(){return({})};
  this.maximum = config.maximum || 100;
}

Goal.prototype = function(){
  function init(room, overrideArgsArr){
    const config = this.override.apply(this, overrideArgsArr);
    const uniqueId = _.uniqueId('goal_');
    room.memory.goal[unqiueId] = Object.assign({
      goal : this.name,
      assigned : [],
      }, 
      {
        override : override
      }
    )
  }

  function onCompletion(){
    //Something;
  }

  return ({
    init : init,
  })
}();

const Priority = function(){

}

const maintainEnergy = new Goal(
  'maintainEnergy',
  job.harvester,
  function(){
    return 5;
  },{

  }
)

const maintainController = new Goal(
  'maintainController',
  job.upgrader,
  function(room){
    return 5;
  },{
    maximum : 1
  }
)

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

// A Priority takes in the current room of the goal, and runs an equation to see
// how important a given goal is at any point.