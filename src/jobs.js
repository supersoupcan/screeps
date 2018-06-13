const ExtractorMover = function(name, extract, resource, work, workSite){
  this.name = name;
  this.role = 'worker',
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.workSite = workSite;
}

ExtractorMover.prototype = function(){
  function initMemory(creep){
    return ({
      isExtracting : false,
      extractionSiteId : findExtractionSite(creep),
      workSiteId : findWorkSite(creep)
    })
  }

  function findWorkSite(){
    let workSites = this.creep.room.find(creep.workSite.find, {
      filter : creep.workSite.filter
    })

    return workSites[_.random(workSites.length)].id;
  }

  function findExtractionSite(){
    switch(this.resource){
      case RESOURCE_ENERGY : {
        return creep.room.provideSource(creep)
      }
    }
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

  return {
    initMemory : initMemory,
    run : run
  }
}

module.exports = {
  Harvester : function(){
    ExtractorMover.call(
      this, 'harvester', 
      Creep.harvest, RESOURCE_ENERGY,
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
    )
  },
  Upgrader : function(){
    ExtractorMover.call(
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
  )},
  Builder : function(structureType){
    ExtractorMover.call(
      'builder_' + structureType,
      Creep.harvest,
      RESOURCE_ENERGY,
      Creep.build,
      {
        find : FIND_MY_CONSTRUCTION_SITES,
        filter : (site) => site.structureType === structureType
      }
    )
  }

}