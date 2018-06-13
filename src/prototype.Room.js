const plan = require('plan');

module.exports = function(){
  function init(){
    initNextPlan();
    this.memory.queue = [];
  }

  function getOwned(){
    return _.filter(Game.creeps, (creep) => {
      creep.memeory.ownedBy === this.room.name;
    })
  }

  function populateQueue(){
    let currentlyOwned = {
      worker : 0,
    };
    getOwned().forEach((creep) => {
      currentlyOwned[creep.role]++;
    })

    this.memory.queue.forEach((roleRequest) => {
      currentlyOwned[roleRequest]++;
    })

    plan[this.controller.level].creeps.forEach((creep) => {
      const difference = creep.amount - currentlyOwned[creep.type];
      if(difference > 0){
        _.times(difference, this.memory.queue.push(creep.type));
      }else if(difference < 0){
        //TODO: commit decimation (evil laugh)
      }
    })
  }

  function initNextPlan(){
    const nextPlan = plan[this.controller.level];
    this.memory.goal = nextPlan.goals.map((goal) => {
      return goal.init();
    });
    getOwned().forEach((creep) => {
      checkForNewGoal(creep);
    })

    populateQueue();
  }

  function checkForNewGoal(creep){
    const goals = plan[this.controller.level].goals;

    let currentGoalIndex = null;
    let goalToBeat = {
      index : null,
      priority : -1
    }

    function higherPriority(goal, index){
      const priority = goal.priority(this);
      if(priority > goalToBeat.priority){
        goalToBeat = {
          index : index,
          priority : priority
        }
      }
    }

    goals.forEach((goal, index) => {
      if(goal.job.role === creep.role){
        if(_.includes(this.memory.goal[index].assigned, creep.name)){
          currentGoalIndex = index;
          higherPriority(goal, index);
        }else if(this.memory.goal[index].assigned.length < goal.maximum){
          higherPriority(goal, index);
        }
      }
      if(goalToBeat.index !== currentGoalIndex){
        if(Number.isInteger(currentGoalIndex)){
          _.remove(this.memory.goal[currentGoalIndex].assigned, function(creepName){
            return creepName === creep.name;
          })
        }
        if(Number.isInteger(jobToBeat.index)){
          this.memory.goal[jobToBeat.index].assigned.push(creep.name);
          goals[jobToBeat.index].job.init(creep);
        }
      }
    })
  }

  return {
    init : init,
    checkForNewGoal : checkForNewGoal,
  }

}();