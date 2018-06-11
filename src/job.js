const ExtractorMover = function(name, extract, resource, work, workSite){
  this.role = 'worker';
  this.name = name;
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.workSite = workSite;
}

ExtractorMover.prototype = function(){
  function init(creep, goalMemory){
    creep.memory = Object.assign({},
      {
        role : creep.memory.role,
        isExtracting : true,
        extractionSiteId : this.findExtractionSite(creep),
        workSiteId : this.findWorkSite(creep),
      },
      goalMemory.override
    )
  }

  function findExtractionSite(creep){
    switch(this.resource){
      case RESOURCE_ENERGY : {
        return creep.room.provideSource(creep)
        break;
      }
    }
  }

  function findWorkSite(creep){
    let workSites = this.creep.room.find(creep.workSite.find, {
      filter : creep.workSite.filter
    })

    return workSites[_.random(workSites.length)].id;
  }

  function isExtracting(creep){
    if(creep.memory.isExtracting && creep.carry[creep.resource] == creep.carryCapacity){
      creep.memory.isExtracting = false;
    }
    else if(!creep.memory.isExtracting && creep.carry[creep.resource] == 0){
      console.log(creep.name + ' completing job loop');
      creep.memory.isExtracting = true;
    }

    return creep.memory.isExtracting;
  }

  function run(creep){
    if(isExtracting(creep)){
      const extractionSite = Game.getObjectById(creep.memory.extractionSiteId);
      switch(this.extract.call(creep, extractionSite)){
        case "ERR_NOT_IN_RANGE" : {
          creep.moveTo(extractionSite);
          break;
        }
      }
    }else{
      const workSite = Game.getObjectById(creep.memory.workSiteId);
      switch(this.work.call(creep, workSite)){
        case "ERR_NOT_IN_RANGE" : {
          creep.moveTo(workSite);
          break;
        }
      }
    }
  }

  return({
    run : run,
    init : init,
  })
}();


ExtractorMover.prototype.constructor = ExtractorMover;

let harvester = new ExtractorMover(
  'harvester', 
  Creep.harvest, 
  RESOURCE_ENERGY, 
  Creep.transfer, 
  {
    find : FIND_MY_STRUCTURES,
    filter : function(structure){
      if(structure.type === STRUCTURE_EXTENSION || structure.type === STRUCTURE_SPAWN){
        return (structure.energy < structure.energyCapacity);
      }else{
        return false;
      }
    }
  }
);

let builder = new ExtractorMover(
  'builder',
  Creep.harvest,
  RESOURCE_ENERGY,
  Creep.build,
  {
    find : FIND_MY_CONSTRUCTION_SITES,
  }
)

module.exports = {
  builder : builder,
  harvester : harvester,
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