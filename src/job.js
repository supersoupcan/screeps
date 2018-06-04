//Job: an object which describes creeps basic actions
//
//argv[0] name = STRING (reference to a job object exported from this module)
//argv[1] init = FUNCTION (the method run by creeps when assigned this job,
//      ( mostly memory configuration))
//argv[2] run = FUNCTION (the method run each tick by creeps with this job)

function Job(name, init, run){
  this.name = name;
  this.init = init;
  this.run = run;
}

//  Job.prototype contains common methods creeps may preform.
//  These methods need to called with the creep

Job.prototype = function(){
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
      sourceId : creep.memory.sourceId ? creep.memory.sourceId : creep.room.provideSource(),
    })
  },
  function(creep){
    if(this.hasWorkingenergy.call(creep)){
      const lowEnergySite = Game.getObjectById(creep.memory.workSiteId);
      switch(this.creep.transfer(lowEnergySite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(lowEnergySite);
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(this.creep.harvest(sourceId)){
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
      switch(this.creep.upgradeController(upgradeSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(upgradeSite);
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(this.creep.harvest(sourceId)){
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
      switch(this.creep.build(buildSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(buildSite)
          break;
        }
      }
    }else{
      const source = Game.getObjectById(creep.memory.sourceId);
      switch(this.creep.harvest(sourceId)){
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