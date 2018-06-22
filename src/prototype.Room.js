const role = require('role');

module.exports = function(){
  function init(){
    this.memory = Object.assign(this.memory, {
      queue : [],
      nextBuild : null,
      [RESOURCE_ENERGY] : [],
    })

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
      console.log(JSON.stringify(goal));
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

    console.log('it all seems so logical!');

    if(goalToBeat.index !== currentGoalIndex){
      if(Number.isInteger(currentGoalIndex)){
        _.remove(this.memory.goal[currentGoalIndex].assigned, function(creepName){
          return creepName === creep.name;
        })
      }
      if(Number.isInteger(goalToBeat.index)){
        console.log(creep.name + ' assigned to ' + goals[goalToBeat.index].name + " (" + goalToBeat.priority + ")" );
        this.memory.goal[goalToBeat.index].assigned.push(creep.name);
        console.log(JSON.stringify(goals[goalToBeat.index]));
        goals[goalToBeat.index].job.init(creep, goalToBeat.index);
      }
    }

    console.log('it all seems so fun!');
  }

  function provideExtraction(creep, extraction){
    console.log('running this magnificent beast');
    let extractionSiteId = null;
    let finalOrderIndex = null;
    let previous = false;

    _.forEach(extraction.weightedOrders, (order, orderIndex) => {
      let eligibleSites = _.filter(this.memory[extraction.resource], function(siteMemory){
        const site = Game.getObjectById(siteMemory[order.targetId]);
        const ofType = siteMemory.type === order.type;
        if(ofType){
          const addFilters = order.addFilters(site);
          const isSafe = ('isSafe' in siteMemory) ? siteMemory.isSafe : false;
          return (ofType && addFilters && isSafe);
        }else{
          return false
        }
      })

      console.log(JSON.stringify(eligibleSites));

      let spaceIndex = -1;
      let finalSiteIndex = null;
      while(spaceIndex < 8 && !Boolean(extractionSiteId)){
        spaceIndex++;
        _.forEach(eligibleSites, (eligibleSiteMemory, eligibleSiteIndex) => {
          if(eligibleSiteMemory.spaces[spaceIndex] === creep.name){
            extractionSiteId = creep.memory.extractionSiteId;
            previous = true;
            return false;
          }else if(eligibleSiteMemory.spaces[spaceIndex] === null){
            extractionSiteId = eligibleSiteMemory[order.targetId];
            finalSiteIndex = eligibleSiteIndex;
            return false;
          }
        })
      }

      console.log(extractionSiteId);

      if(Boolean(extractionSiteId)){
        finalOrderIndex = orderIndex;
        if(!previous){
          eligibleSites[finalSiteIndex].spaces[spaceIndex] = creep.name;
          let success = false;
          _.forEach(this.memory[extraction.resource], (siteMemory, siteIndex) => {
            _.forEach(siteMemory.spaces, (space, index) => {
              if(space === creep.name){
                space = null;
                success = true;
                return false;
              }
            })
            if(success){
              return false;
            }
          });
        }
        return false
      }
    })

    console.log('FINAL', finalOrderIndex, extractionSiteId)

    return {
      index : finalOrderIndex,
      id : extractionSiteId,
    }
  }
  
  return {
    init : init,
    initNextPlan : initNextPlan,
    checkForNewGoal : checkForNewGoal,
    provideExtraction : provideExtraction
  }
}();