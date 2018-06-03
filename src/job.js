//Job: an object which describes creeps basic actions
//
//argv[0] name = STRING (reference to a job object exported from this module)
//argv[1] run = FUNCTION (the method run each tick by creeps with this job)
//argv[2] init = FUNCTION (the method run by creeps when assigned this job,
//      ( mostly memory configuration))

function Job(name, run, init){
  this.name = name;
  this.run = run;
  this.init = init;
}

//  Job.prototype contains common methods creeps may preform.
//  These methods need to called with the parent

Job.prototype = function(){
  function checkIsWorking(){
    if(this.memory.working && this.carry.energy == 0){
      this.memory.working = false;
    }else if(!this.memory.working && this.carry.energy == this.carryCapacity){
      this.memory.working = true;
    }

    return this.memory.working;
  }

  function targetActionOrIsMove(action, target){
    if(this[action](target) == ERR_NOT_IN_RANGE){
      this.moveTo(target);
      return true;
    }
    return false;
  }

  return({
    manageWorking : manageWorking,
    targetActionOrIsMove : targetActionOrIsMove,
  })
}();


const upgrader = new Job(
  'upgrader', 
  function(parent){
    if(this.checkIsWorking.call(parent)){
      this.targetActionOrIsMove.call(parent, 'upgradeController', parent.memory.target)
    }
  },
  function(parent){
    _.assign(parent.memory,
      {
        job : this.name, 
        working : false,
        target: parent.room.establishTarget('controller'),
        source: parent.room.establishSource()
      })
  }
);


module.exports = {
  upgrader : updrader,
}