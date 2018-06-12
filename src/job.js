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
      if(structure.structureType === STRUCTURE_EXTENSION || structureType === STRUCTURE_SPAWN){
        return (structure.energy < structure.energyCapacity);
      }else{
        return false;
      }
    }
  }
);

let upgrader = new ExtractorMover(
  'upgrader',
  Creep.harvest,
  RESOURCE_ENERGY,
  Creep.upgradeController,
  {
    find : FIND_MY_STRUCTURES,
    filter : function(structure){
      return structure.structureType === STRUCTURE_CONTROLLER
    }
  }
)

let Builder = function(construction_type){
  ExtractorMover.call(this,'Builder',
    Creep.harvest,
    RESOURCE_ENERGY,
    Creep.build,
    {
      find : FIND_MY_CONSTRUCTION_SITES,
      filter : function(site){
        return site.structureType = construction_type
      }
    }
  )
}

module.exports = {
  Builder : Builder,
  harvester : harvester,
}