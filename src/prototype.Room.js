const plan = require('plan');

module.exports = function(){
  function init(){
    this.memory.queue = [];
    initNextPlan.call(this);
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

    _.forEach(getOwned.call(this), (creep) => {
      currentlyOwned[creep.role]++;
    })

    _.forEach(this.memory.queue, (roleRequest) => {
      currentlyOwned[roleRequest]++;
    })

    _.forEach(plan[this.controller.level].creeps, (creep) => {
      const difference = creep.amount - currentlyOwned[creep.role.name];
      
      if(difference > 0){
        console.log(difference, creep.role.name);
        _.times(difference, () => {this.memory.queue.push(creep.role.name)});
      }else if(difference < 0){
        //TODO: commit decimation (evil laugh)
      }
    })
  }

  function initNextPlan(){
    const nextPlan = plan[this.controller.level];
    this.memory.goal = nextPlan.goals.map((goal) => {
      return goal.initMemory();
    });
    getOwned.call(this).forEach((creep) => {
      checkForNewGoal.call(this, creep);
    })

    populateQueue.call(this);
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
      console.log('proirity', priority);
      if(priority > goalToBeat.priority){
        goalToBeat = {
          index : index,
          priority : priority
        }
      }
    }

    goals.forEach((goal, index) => {
      if(goal.job.role === creep.memory.role){
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
        if(Number.isInteger(goalToBeat.index)){
          this.memory.goal[goalToBeat.index].assigned.push(creep.name);
          goals[goalToBeat.index].job.init(creep, goalToBeat.index);
        }
      }
    })
  }

  return {
    init : init,
    checkForNewGoal : checkForNewGoal,
  }

}();