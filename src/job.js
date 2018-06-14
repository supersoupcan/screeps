const ExtractorMover = function(name, extract, resource, work, workSite){
  this.name = name;
  this.role = 'worker',
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.workSite = workSite;
}

ExtractorMover.prototype = function(){
  function init(creep, goalIndex){
    creep.memory.assign({}, {
      role : creep.memory.role,
      ownedBy : creep.memory.ownedBy,
    },{
      goalIndex : goalIndex,
      isExtracting : false,
      extractionSiteId : findExtractionSite.call(this, creep),
      workSiteId : findWorkSite.call(this, creep)
    })
  }

  function findWorkSite(creep){
    let workSites = Game.room[creep.memory.ownedBy].find(this.workSite.find, {
      filter : this.workSite.filter
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
    init : init,
    run : run
  }
}();

let Harvester = function(){
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
}

Harvester.prototype = ExtractorMover.prototype;

let Upgrader = function(){
  ExtractorMover.call(
    this, 'upgrader',
    Creep.harvest,
    RESOURCE_ENERGY,
    Creep.upgradeController,
    {
      find : FIND_MY_STRUCTURES,
      filter : function(structure){
        return structure.structureType === STRUCTURE_CONTROLLER
    }
  }
)}

Upgrader.prototype = ExtractorMover.prototype;

let Builder = function(structureType){
  ExtractorMover.call(
    this, 'builder_' + structureType,
    Creep.harvest,
    RESOURCE_ENERGY,
    Creep.build,
    {
      find : FIND_MY_CONSTRUCTION_SITES,
      filter : (site) => site.structureType === structureType
    }
  )
}

Builder.prototype = ExtractorMover.prototype;

module.exports = {
  Harvester : Harvester,
  Upgrader : Upgrader,
  Builder : Builder,
}