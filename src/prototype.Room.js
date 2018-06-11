const role = require('role');
const job = require('job');
const goal = require('goal');

module.exports = function(){
  function init(isMaster){
    if(true){
      //STRATEGY MODULE;
    }

    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })
  }

  function addGoal(goal){
    goal.init(room);
  }

  function checkForNewJob(creep){
    let goalToBeat = {
      goalId : null,
      priority : -1,
    }

    let currentGoalId = null;

    function higherPriority(goalDataToCheck, goalId){
      const priority = goalDataToCheck.priority(this);
      if(priority > goalToBeat.priority){
        goalToBeat = {
          goalId : goalId,
          priority : priority
        }
      }
    }

    _.forEach(this.memory.goal, function(goalMemory, goalId){
      //If goal is currentGoal
      const goalData = goal[goalMemory.name];

      if(goalData.job.role === creep.role){
        if(_.includes(goalMemory.assigned, creep.name)){
          currentGoalId = goalId;
          higherPriority(goalData, goalId);
        }else if(goalMemory.assigned.length < goalData.maximum){
          higherPriority(goalData, goalId);
        }
      }
    })

    if(goalToBeat.goalId !== currentGoalId){
      if(currentGoalId){
        _.remove(this.memory.goal[currentGoalId].assigned, function(creepName){
          return creepName === creep.name;
        })
      }
      if(jobToBeat.goalId){
        const nextGoalMemory = this.memory.goal[jobToBeat.goalId];
        const nextGoalData = goal[nextGoalMemory.name];

        nextGoalMemory.assigned.push(creep.name);
        nextGoalData.job.init(creep, nextGoalMemory.override);
      }
    }
  }

  function provideSource(creep){
    let openSourceId = false;
    _.forEach(room.memory.sources, function(source, sourceId){
      if(source.isSafe){
        _.forEach(source.spots, function(spot){
          if(!spot.assigned){
            spot = {
              assigned : true,
              name : creep.name,
            };
            openSourceId = sourceId;
            return false;
          }
        })
      }
      return openSourceId;
    });
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