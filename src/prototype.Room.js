const role = require('role');
const job = require('job');
const goal = require('goal');

module.exports = function(){
  function init(){
    /*
    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })
    
    */
   addGoal.call(this), goal['maintainGoals', ''];
  }

  function addGoal(goal){
    goal.init(room);
  }

  function checkForNewJob(creep){
    let currentGoal = goalToBeat(){
      
    }
    //
    _.forEach(this.memory.goal, function(goalMemory, goalId){
      //If goal is currentGoal
      const goalData = goal[goalMemory.name];

      if(goalData.job.role === creep.role){
        if(_.includes(goalMemory.assigned, creep.name)){

        }else if(goalMemory.assigned.length < goalData.maximum){

        }
      }

      if(goalData.job.role === creep.role){
        goalData.getPriority(this);
      }

      //if(_.includes(goalMemory.assigned, creep.name)){}


      
    })
  }

  function provideWorkSite(type){
    //Kind of worksites we expect
    //Controllers
    //Low Energy Buidlings
  }

  function provideSource(creep){
    let openSpot = false;
    _.forEach(room.memory.sources, function(source, sourceId){
      if(source.isSafe){
        _.forEach(source.spots, function(spot){
          if(!spot.assigned){
            spot = {
              assigned : true,
              name : creep.name,
            };
            openSource = sourceId;
            return false;
          }
        })
      }
      return openSource;
    })
  }

  return{
    init : init,
    manageGoals : manageGoals,
    //provideWorkSite : provideWorkSite,
    //provideSource : provideSource,
    //findJob : findJob,
    //strategy : strategy,
  }
}();