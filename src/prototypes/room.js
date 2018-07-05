const roles = require('models_roles');

module.exports = function(){
  const getters = {
    get owned(){
      return _.filter(Game.creeps, (creep) => {
        creep.memory.ownerId = this.name;
      })
    }
  }

  function init(){
    this.memory.goals = {};
    this.memory.roles = {};
    this.memory.spawn = {};
    this.memory.extraction = {};
    this.memory.layout = {};
  }

  function addGoal(goal){
    if(goal.name in this.memory.goals){
      console.log("Can't add " + goal.name + "to room to " 
        + this.name + ": already assigned");
    }else{
      room.memory[goal.name] = goal.initRoomMemory();
    }
  }

  function findGoal(creep){
    let goalToBeat = {
      name : null,
      priority : 0
    };
    _.forEach(this.memory.goals, (goal) => {
      const currentPriority = goal.getPriority(room, creep);
      if(currentPriority > goalToBeat.priority){
        goalToBeat.name = goal.name;
        priorty = currentPriority;
      }
      //TODO: overide and break if creep priority is greater then one currently assigned to something; 
    })
    if(creep.memory.goal && creep.memory.goal !== goalToBeat.name ){
      const indexToRemove = _.findIndex(this.memory.goals[creep.memory.goal].assignments, (goal) => {
        return (goal.creepName === creep.name)
      })
      this.memory.goals[creep.goal].assignments.splice(indexToRemove, 1);
    }
    this.memory.goals[goalToBeat].assignments.push({
      creepName : creep.name
    })
    creep.goal = goalToBeat.name;
  }

  function getExtraction(resource, type){
    if(type){
      return _.filter(
        this.extractionMemory[resource], 
        (provider) => provider.type === type
      )
    }

    return this.memory.extraction[resource];
  }

  function populateQueue(){
    let populationCount = {};
    _.forEach(this.memory.roles, (role, roleName) => {
      populationCount[roleName] = 0; 
    })
    _.forEach(this.owned, (creep) => {
      populationCount[creep.role]++;
    })
    _.forEach(this.memory.spawn.queue, (role) => {
      populationCount[role]++;
    })
    if(this.memory.spawn.next){
      populationCount[this.memory.spawn.next.role]++;
    }
    _.forEach(this.memory.roles, (role, roleName) => {
      const difference = role.amount - populationCount[roleName];
      if(difference > 0){
        _.times(difference, () => this.memory.spawn.queue.push(roleName));
      }else if (difference < 0){
        //do something in the future perhaps
      }
    })
  }

  function getExtractionTargets(resource, provider){
    let eligibleTargets = [];
    _.forEach(this.memory.extraction[resource], (providerMemory, index) => {
      if(providerMemory.type === provider.type){
        const targetMemory = providerMemory[provider.target];
        const filter = provider.filter(Game.getObjectById(targetMemory.id));
        const isSafe = ('isSafe' in providerMemory) 
          ? providerMemory.isSafe : true;
        if(filter && isSafe){
          eligibleTargets.push(targetMemory)
        }
      }
    })
    return eligibleTargets;
  }

  function countExtractionTargets(resource, countType, isSafe){
    let count = 0;
    _.forEach(this.memory.extraction[resource], (type) => {
      if(type === countType && type.isSafe === isSafe){
        count++;
      }
    })
    return count;
  }

  function addRole(role, amount){
    if(!role.name in this.memory.roles[role]){
      this.memory.roles[role.name] = role.init();
    }
    this.memory.roles[role.name].amount += amount || 1;
  }

  const public = {
    addGoal : addGoal,
    addRole : addRole,
    populateQueue : populateQueue,
    findGoal : findGoal,
    getExtraction : getExtraction,
    countExtractionTargets: countExtractionTargets,
    getExtractionTargets : getExtractionTargets,
    init : init,
    levelChange : levelChange,
  }

  return Object.assign({}, getters, setters, public);
}();