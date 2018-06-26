const role = require('role');
const base = require('base');
const plan = require('plan');

module.exports = function(){
  function init(){
    this.memory = Object.assign(this.memory, {
      queue : [],
      nextBuild : null,
      [RESOURCE_ENERGY] : [],
    })

    const spawns = this.find(FIND_MY_STRUCTURES, {
      filter : { structureType : STRUCTURE_SPAWN}
    })

    if(spawns.length > 0){
      this.memory.base = {
        x : spawns[0].pos.x,
        y : spawns[0].pos.y,
        rotation : 0,
      }
    }else{
      //find base location layout function, and give room a score;
    }

    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })

    initNextPlan.call(this);
  }

  function getOwned(){
    return _.filter(Game.creeps, (creep) => {
      return creep.memory.ownedBy === this.name;
    })
  }

  function getPlan(){
    return plan[this.controller.level];
  }

  function populateQueue(){
    let currentlyOwned = {};
    _.forEach(role, (data, roleName) => {
      currentlyOwned[roleName] = 0;
    })
    _.forEach(getOwned.call(this), (creep) => {
      currentlyOwned[creep.memory.role]++;
    })
    _.forEach(this.memory.queue, (requestedRole) => {
      currentlyOwned[requestedRole]++;
    })
    if(this.memory.nextBuild){
      currentlyOwned[this.memory.nextBuild.role]++;
    }

    _.forEach(getPlan.call(this).creeps, (creep) => {
      const difference = creep.amount - currentlyOwned[creep.role.name];
      if(difference > 0){
        console.log('adding ' + difference + ' ' + creep.role.name + 's to queue');
        _.times(difference, () => {this.memory.queue.push(creep.role.name)});
      }else if(difference < 0){
        // do something?
      }
    })
  }

  function initNextPlan(){
    if(this.memory.base){
      base.standard.planConstruction(this);
    }
    console.log('room ' + this.name + ' changed level to ' + this.controller.level);

    const nextPlan = this.getPlan.call(this);
    this.memory.level = this.controller.level;
    
    this.memory.goal = nextPlan.goals.map((goal) => {
      return goal.initMemory();
    });
    _.forEach(getOwned.call(this), (creep) => {
      checkForNewGoal.call(this, creep);
    });

    populateQueue.call(this);
  }

  function checkForNewGoal(creep){
    const goals = getPlan.call(this).goals;
    let currentGoalIndex = null;
    let goalToBeat = {
      index : null,
      priority : -1
    }

    function higherPriority(goal, index, alreadyHasThisGoal){
      const priority = goal.getPriority(
        this, 
        this.memory.goal[index],
        alreadyHasThisGoal
      );

      if(priority > goalToBeat.priority){
        goalToBeat = {
          index : index,
          priority : priority
        }
      }
    }
 
    _.forEach(goals, (goal, index) => {
      if(goal.job.role === creep.memory.role){
        if(_.includes(this.memory.goal[index].assigned, creep.name)){
          //IF CREEP ALREADY HAS JOB
          currentGoalIndex = index;
          higherPriority.call(this, goal, index, true);
        }else if(this.memory.goal[index].assigned.length < goal.maximum){
          //CHECK JOBS MAXIMUM LIMIT HAS NOT BEEN TAKEN
          //MIGHT BE ABLE TO GET RID OF THIS WITH THE PRIORITY FUNCTIONS
          higherPriority.call(this, goal, index, false);
        }
      }
    });

    if(goalToBeat.index !== currentGoalIndex){
      if(Number.isInteger(currentGoalIndex)){
        _.remove(this.memory.goal[currentGoalIndex].assigned, function(creepName){
          return creepName === creep.name;
        })
      }
      if(Number.isInteger(goalToBeat.index)){
        console.log(creep.name + ' assigned to ' + goals[goalToBeat.index].name + " (" + goalToBeat.priority + ")" );
        this.memory.goal[goalToBeat.index].assigned.push(creep.name);
        goals[goalToBeat.index].job.init(creep, goalToBeat.index);
      }
    }
  }

  return {
    init : init,
    getPlan : getPlan,
    populateQueue : populateQueue,
    initNextPlan : initNextPlan,
    checkForNewGoal : checkForNewGoal,
  }
}();