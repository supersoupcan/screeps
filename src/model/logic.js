const standard = function(){
  function init(creep){
    creep.memory.job.isExtracting = true;
    this.extraction.provide(creep);
    this.worksite.provide(creep);
  }

  function checkExtracting(creep){
    if(creep.isFull() && creep.job.isExtracting){
      creep.job.isExtracting = falsed;
    }else if(!creep.has(this.extraction.resource) && !creep.job.isExtracting){
      creep.job.isExtracting = true;
    }
    return creep.job.isExtracting;
  }

  function run(creep){
    if(!creep.memory.extraction){
      this.extraction.provide(creep);
    }

    if(checkExtracting.call(this, creep)){
      const extractionSite = Game.getObjectById(creep.memory.extractionSite.id);
      const method = this.extraction.providers[creep.memory.extraction.type].method;
      switch(method.call(creep, extractionSite)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(extractionSite);
          break;
        }
      }
    }else{
      const workSite = Game.getObjectById(creep.memory.workSiteId);
      const important = this.work.call(creep, workSite, this.extraction.resource);
      switch(important){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(workSite);
          break;
        }
        case ERR_FULL : {
          findWorkSite.call(this, creep);
          break;
        }
        case ERR_INVALID_TARGET : {
          findWorkSite.call(this, creep);
          break;
        }
      }
    }
  }

  return{
    init : init,
    run : run,
  }
}();


module.exports = {
  standard : standard,
}