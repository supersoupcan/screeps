const ExtractorMover = function(name, extract, resource, work, workSite){
  this.name = name;
  this.extract = extract;
  this.resource = resource;
  this.work = work;
  this.workSite = workSite;
  this.role = 'worker';
}

ExtractorMover.prototype = function(){
  function init(creep, goalIndex){
    creep.memory = Object.assign({}, {
      role : creep.memory.role,
      ownedBy : creep.memory.ownedBy,
    },{
      goalIndex : goalIndex,
      isExtracting : true,
      extractionSiteId : findExtractionSiteId.call(this, creep),
      workSiteId : findWorkSite.call(this, creep)
    })
  }

  function findWorkSite(creep){
    let workSites = Game.rooms[creep.memory.ownedBy].find(this.workSite.find, {
      filter : this.workSite.filter
    })

    if(workSites.length > 0){
      const final = workSites[_.random(workSites.length - 1)].id;
      console.log('setting workplace ' + final + ' for ' + this.name);
      return final;
    }else{
      console.log('no workplace found for ' + this.name);
      Game.rooms[creep.memory.ownedBy].checkForNewGoal(creep);
    }
  }

  function findExtractionSiteId(creep){
    if(creep.memory.extractonSiteId){
      let site = Game.getObjectById(creep.memory.extractonSite);
    }

    switch(this.resource){
      case RESOURCE_ENERGY : {
        return creep.room.provideSource(creep);
      } 
    }
  }
  
  function isExtracting(creep){
    //console.log(creep.carry[this.resource] === creep.carryCapacity);
    if(creep.memory.isExtracting && creep.carry[this.resource] === creep.carryCapacity){
      creep.memory.isExtracting = false;
    }else if(!creep.memory.isExtracting && creep.carry[this.resource] === 0){
      creep.memory.isExtracting = true;
      Game.rooms[creep.memory.ownedBy].checkForNewGoal(creep);
    }
    return creep.memory.isExtracting;
  }

  function run(creep){
    if(isExtracting.call(this, creep)){
      const extractionSite = Game.getObjectById(creep.memory.extractionSiteId);
      switch(this.extract.call(creep, extractionSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(extractionSite);
          break;
        }
      }
    }else{
      const workSite = Game.getObjectById(creep.memory.workSiteId);
      const important = this.work.call(creep, workSite, this.resource);
      //console.log(important, workSite.structureType);
      switch(important){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(workSite);
          break;
        }
        case ERR_FULL : {
          findWorkSite.call(this, creep);
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

let HarvesterCarrier = function(){
  ExtractorMover.call(
    this, 'harvesterCarrier',
    Creep.prototype.harvest, 
    RESOURCE_ENERGY,
    Creep.prototype.transfer,
    {
      find : FIND_MY_STRUCTURES,
      filter : function(structure){
        if(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN){
          return (structure.energy < structure.energyCapacity);
        }else{
          return false;
        }
      }
    }
  )
}

HarvesterCarrier.prototype = ExtractorMover.prototype;

let HarvesterUpgrader = function(){
  ExtractorMover.call(
    this, 'harvesterUpgrader',
    Creep.prototype.harvest,
    RESOURCE_ENERGY,
    Creep.prototype.upgradeController,
    {
      find : FIND_MY_STRUCTURES,
      filter : function(structure){
        return structure.structureType === STRUCTURE_CONTROLLER
    }
  }
)}

HarvesterUpgrader.prototype = ExtractorMover.prototype;

let HarvesterBuilder = function(structureType){
  ExtractorMover.call(
    this, 'harvesterBuilder_' + structureType,
    Creep.prototype.harvest,
    RESOURCE_ENERGY,
    Creep.prototype.build,
    {
      find : FIND_MY_CONSTRUCTION_SITES,
      filter : (site) => site.structureType === structureType
    }
  )
}

HarvesterBuilder.prototype = ExtractorMover.prototype;

module.exports = {
  HarvesterCarrier: HarvesterCarrier,
  HarvesterUpgrader : HarvesterUpgrader,
  HarvesterBuilder : HarvesterBuilder,
}