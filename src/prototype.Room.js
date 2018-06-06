const role = require('role');
const job = require('job');
const goal = require('goal');

module.exports = function(){
  function init(){
    /*
    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })
    
    */

   this.addGoal(goal.maintainEnergy); 
  }

  function addGoal(goal){
    const id = _.uniqueId('goal_');
    this.memory.goals[uniqueId] =
  }


  function provideWorkSite(type){
    //Kind of worksites we expect
    //Controllers
    //Low Energy Buidlings
  }

  function provideSource(creep){
    let openSpot = false;
    _.forEach(room.memory.sources, function(source, sourceId){
      if(source.isSafe){
        _.forEach(source.spots, function(spot){
          if(!spot.assigned){
            spot = {
              assigned : true,
              name : creep.name,
            };
            openSource = sourceId;
            return false;
          }
        })
      }
      return openSource;
    })
  }

  return{
    init : init,
    provideWorkSite : provideWorkSite,
    provideSource : provideSource,
    findJob : findJob,
    strategy : strategy,
  }
}();