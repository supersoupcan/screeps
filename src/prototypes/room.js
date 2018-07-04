const roles = require('models_roles');

module.exports = function(){
  const setters = {
    set goals(goals){
      this.room.memory.goals = goals;
    }
  }

  const getters = {
    get goals(){
      return this.room.memory.goals;
    },
    get owned(){
      return _.filter(Game.creeps, (creep) => {
        creep.memory.ownerId = this.name;
      })
    }
  }

  function addGoal(goal){
    if(goal.name in this.goals){
      console.log("Can't add " + goal.name + "to room to " 
        + this.name + ": already assigned");
    }else{
      goal.init(room);
    }
  }

  function findGoal(creep){
    let goalToBeat = {
      name : null,
      priority : 0
    };

    _.forEach(this.goals, (goal) => {
      const currentPriority = goal.getPriority(room, creep);
      if(currentPriority > goalToBeat.priority){
        goalToBeat.name = goal.name;
        prioirty = currentPriority;
      }
    })

    if(creep.goal !== goalToBeat.name && creep.goal){
      const indexToRemove = _.findIndex(this.goals[creep.goal].assignments, (goal) => {
        return (goal.creepName === creep.name)
      })

      this.goals[creep.goal].assigned.splice(indexToRemove, 1);
    }
      
    this.goals[goalToBeat].assignments.push({
      creepName : creep.name
    })

    creep.goal = goalToBeat.name;
  }

  function getProviders(resource, type){
    if(type){
      return _.filter(
        this.memory.providers[resource], 
        (provider) => provider.type === type
      )
    }

    return this.memory.providers[resource]
  }

  function populateQueue(){
    let populationCount = {};
    _.forEach(this.memory.roles, (role, roleName) => {
      populationCount[roleName] = 0; 
    })
    _.forEach(this.owned, (creep) => {
      populationCount[creep.role]++;
    })
    _.forEach(this.memory.queue, (role) => {
      populationCount[role]++;
    })
    if(this.memory.nextSpawn){
      populationCount[this.memory.nextSpawn.role]++;
    }
    _.forEach(this.memory.roles, (role, roleName) => {
      const difference = role.amount - populationCount[roleName];
      if(difference > 0){
        _.times(difference, () => this.memory.queue.push(roleName));
      }else if (difference < 0){
        //do something in the future perhaps
      }
    })
  }

  function levelChange(){

  }

  function getExtractionTargets(resource, provider){
    let eligibleTargets = [];
    _.forEach(this.memory.providers[resource], (providerMemory, index) => {
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

  function addRole(role, amount){
    if(!role.name in this.memory.roles[role]){
      this.memory.roles[role.name] = role.init();
    }
    this.memory.roles[role.name].amount += amount || 1;
  }

  function init(){
    this.memory.goals = {};
    this.memory.roles = {};
    this.memory.providers = {};
  }

  const public = {
    addGoal : addGoal,
    addRole : addRole,
    populateQueue : populateQueue,
    findGoal : findGoal,
    getProviders : getProviders,
    getExtractionTargets : getExtractionTargets,
    init : init,
    levelChange : levelChange,
  }

  return Object.assign({}, getters, setters, public);
}();