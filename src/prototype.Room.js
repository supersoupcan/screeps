const plan = require('plan');

module.exports = function(){
  function init(){
    initNextPlan();
  }

  function initNextPlan(){
    const nextPlan = plan[this.controller.level];
    this.memory.goal = nextPlan.goals.map((goal) => {
      return goal.init();
    })
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