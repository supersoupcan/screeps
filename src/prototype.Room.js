const role = require('role');

module.exports = function(){
  function init(){
    this.memory.sources = [];
    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })

    this.memory.queue = [];
    this.memory.nextBuild = null;

    initNextPlan.call(this);
  }

  function getOwned(){
    return _.filter(Game.creeps, (creep) => {
      return creep.memory.ownedBy === this.name;
    })
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

    _.forEach(this.controller.getPlan().creeps, (creep) => {
      console.log(JSON.stringify(creep));
      console.log('population check ' + creep.role.name + ' ' + currentlyOwned[creep.role.name]);
      const difference = creep.amount - currentlyOwned[creep.role.name];
      console.log('spawning ' + difference)
      if(difference > 0){
        _.times(difference, () => {this.memory.queue.push(creep.role.name)});
      }else if(difference < 0){
        //TODO: commit decimation (evil laugh)
      }
    })
  }

  function initNextPlan(){
    console.log('room ' + this.name + ' changed level to ' + this.controller.level);
    const nextPlan = this.controller.getPlan();
    this.memory.level = this.controller.level;
    this.memory.goal = nextPlan.goals.map((goal) => {
      return goal.initMemory();
    });
    _.forEach(getOwned.call(this), (creep) => {
      checkForNewGoal.call(this, creep);
    })

    populateQueue.call(this);
  }

  function checkForNewGoal(creep){
    console.log('assigning goal to ' + creep.name);
    const goals = this.controller.getPlan().goals;
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

      console.log(goal.name + " priority: " + priority);

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

  function provideSource(creep){
    let safeSources = _.filter(this.memory.sources, { 'isSafe' : true });
    let spaceIndex = -1;
    let sourceId = null;
    while(spaceIndex < 8 && !Boolean(sourceId)){
      spaceIndex++;
      _.forEach(safeSources, (sourceMemory, index) => {
        if(sourceMemory.spaces[spaceIndex] === null){
          sourceId = sourceMemory.id;
          return false;
        }
      })
      console.log('round ' + spaceIndex);
    }
  

    let sourceIndex = _.findIndex(this.memory.sources, {id : sourceId});
    this.memory.sources[sourceIndex].spaces[spaceIndex] = creep.name;
    return sourceId;
  }
  
  return {
    init : init,
    initNextPlan : initNextPlan,
    checkForNewGoal : checkForNewGoal,
    provideSource : provideSource,
  }
}();