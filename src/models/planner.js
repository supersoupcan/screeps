module.exports = function(){
  const goals = [
    {

    }
  ]

  function addGoal(room){
    if(goal.name in room.memory.goals){
      console.log("Can't add " + goal.name + "to room to " 
        + room.name + ": already assigned");
    }else{
      room.memory.goals[goal.name] = goal.initRoomMemory()
    }
  }

  function evaluateRoles(room){
    const totalPopulation = 10;

    _.forEach(goal, (goal, goalName) => {
      _.forEach(goal.roles, (role) => {
        role.job.extraction.countProviders(room);
      });
    })
  }

  function removeGoal(goal, room){
    const creepsWhoNeedNewGoals = _.map(
      goal.getMemory(room).assignments,
      (assignment) => Game.creeps[assignment.creepName]
    );

    delete room.memory.goals[goal.name];

    _.forEach(creepsWhoNeedNewGoals, (creep) => {
      room.findGoal(creep);
    })
  }

  function completionCallback(goal, room){

    //Some logic to progress add another goal or progresss to something different;


    removeGoal.call(this, goal);
  }


  return {
    addGoal : addGoal,
  }
}();