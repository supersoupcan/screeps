const standard = function(){
  function init(creep){
    creep.memory.job = {};
    creep.memory.job.isExtracting = true;
    this.extraction.provideCreep(creep);
    this.worksite.provideCreep(creep);
  }

  function checkExtracting(creep){
    const isExtracting = creep.memory.job.isExtracting;
    if(creep.isFull() && isExtracting){
      isExtracting = false;
    }else if(!creep.has(this.extraction.resource) && !isExtracting){
      isExtracting = true;
    }
    return isExtracting;
  }

  function run(creep){
    if(!creep.job.extraction) this.extraction.provideCreep(creep);
    if(!creep.job.worksite) this.worksite.provideCreep(creep);

    if(checkExtracting.call(this, creep)){
      const target = Game.getObjectById(creep.memory.extraction.targetId);
      const method = this.extraction.providers[creep.memory.extraction.type].method;
      switch(method.call(creep, target)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(target);
          break;
        }
      }
    }else{
      const target = Game.getObjectById(creep.job.workSite.targetId);
      switch(method.call(creep, target, this.extraction.resource)){
        case ERR_NOT_IN_RANGE : {
          creep.moveTo(target);
          break;
        }
        case ERR_FULL : {
          this.worksite.provide(creep);
          break;
        }
        case ERR_INVALID_TARGET : {
          this.worksite.provide(creep);
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