function Job(role){
  this.role = role;
};

Job.prototype = function(){
  return({

  })
}

const ExtractorMover = function(name, extract, resource, work, workSite){
  Job.call(this, 'worker');
  this.name = name;
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.workSite = workSite;
}

ExtractorMover.prototype = Object.create(Job.prototype, function(){
  function init(creep, config){
    Object.assign(creep.memory, {
      job : this.name,
      isExtracting : true,
      workSiteId : findWorkSite(),
      extractSiteId : findResource(),
    })
  }

  function isExtracting(creep){
    if(creep.memory.isExtracting && creep.carry[creep.resource] == creep.carryCapacity){
      creep.memory.isExtracting = false;
    }
    else if(!creep.memory.isExtracting && creep.carry[creep.resource] == 0){
      //Signal goal check
      creep.memory.isExtracting = true;
    }

    return creep.memory.isExtracting;
  }

  function run(creep){
    if(isExtracting(creep)){
      switch(this.extract.call(creep)){
        case "ERR_NOT_IN_RANGE" : {
          creep.moveTo(Game.getObjectById(creep.memory.extractionSiteId));
        }
      }
    }else{

    }
  }

  return({
    run : run,
    init : init,
  })
});


ExtractorMover.prototype.constructor = ExtractorMover;

let harvester = new ExtractorMover('harvester', Creep.harvest, RESOURCE_ENERGY, Creep.transfer, STRUCTURE_CONTROLLER)

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