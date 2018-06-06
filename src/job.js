function Job(goalId){
  this.goalId = goalId;
};

Job.prototype = function(){

  return({

  })
}

const ExtractorMover = function(goalId, name, extract, resource, work, destination){
  Job.call(this, goalId);
  this.name = name;
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.destination = destination;
}

Mover.prototype = Object.create(Job.prototype, function(){
  function hasCargo(creep){
    if(creep.memory.isWorking && creep.carry[this.resource] == 0){
      creep.memory.isWorking = false;
    }else{

    }
  }

  function run(creep){
    this.extract.call(creep);
  }

  function init(creep){
    Object.assign(creep.memory, {
      job : this.name,
      isWorking : false,
      workSiteId : findWorkSite(),
      extractSite : findResource(),
    })
  }

  return({
    run : run,
    init : init,
  })
});

ExtractorMover.prototype.constructor = ExtractorMover;


let harvester = function(goalId){
  new ExtractorMover(Creep.harvest, RESOURCE_ENERGY, Creep.transfer, STRUCTURE_CONTROLLER)
}
  
/*

  function hasWorkingEnergy(){
    //Checks and Updates if creep has enough energy to work
    //returns updated isWorking value

    if(this.memory.isWorking && this.carry.energy == 0){
      this.memory.isWorking = false;
    }else if(!this.memory.isWorking && this.carry.energy == this.carryCapacity){
      this.memory.isWorking = true;
    }
    return this.memory.isWorking;
  }

  return({
    hasWorkingEnergy : hasWorkingEnergy,
  })
}();

const harvester = new Job(
  'harvester',
  function(creep){
    _.assign(creep.memory, {
      job : this.name,
      isWorking : false,
      workSiteId : creep.room.provideWorkSite('lowEnergy'),
      sourceId : creep.memory.sourceId ? creep.memory.sourceId : creep.room.provideSource(creep),
    })
  },
  function(creep){
    if(this.hasWorkingenergy.call(creep)){
      const lowEnergySite = Game.getObjectById(creep.memory.workSiteId);
      switch(creep.transfer(lowEnergySite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(lowEnergySite);
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(creep.harvest(sourceId)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(source);
          break;
        }
      }
    }
  }
)

const upgrader = new Job(
  'upgrader',
  function(creep){
    _.assign(creep.memory,{
      job : this.name, 
      isWorking : false,
      workSiteId: creep.room.provideWorkSite('controller'),
      sourceId: creep.memory.sourceId ? creep.memory.sourceId : creep.room.provideSource(),
    })
  },
  function(creep){
    if(this.hasWorkingEnergy.call(creep)){
      const upgradeSite = Game.getObjectById(creep.memory.workSiteId);
      switch(creep.upgradeController(upgradeSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(upgradeSite);
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(creep.harvest(sourceId)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(source);
          break;
        }
      }
    }
  },
);

const builder = new Job(
  'builder',
  function(creep){
    _.assign(creep.memory, {
      job : this.name,
      isWorking : false,
      workSiteId : creep.room.provideWorkSite('constructionSite'),
      sourceId: creep.memory.sourceId ? creep.memory.sourceId : creep.room.provideSource(),
    })
  },
  function(creep){
    if(this.hasWorkingEnergy.call(creep)){
      const buildSite = Game.getObjectById(creep.memory.workSiteId);
      switch(creep.build(buildSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(buildSite)
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(creep.harvest(sourceId)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(source);
          break;
        }
      }
    }
  }
)

module.exports = {
  harvester : harvester,
  upgrader : upgrader,
  builder : builder,
}

*/