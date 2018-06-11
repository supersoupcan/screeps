const utils = require('utils');

module.exports = function(){
  function init(){
    this.room.memory.source[this.id] = {
      isSafe : this.isSafe(),
      spots : this.avaliableSpots(),  
    }
  }

  function availableSpots(){
    const capacityData = utils.lookAround(this, 1, function(tile){
      return _.every(tile, function(object){
        switch(object.type){
          case 'terrain' : {
            return object.terrain === 'plain' || object.terrain === 'swamp';
          }
          case 'structure' : {
            return object.structure.structureType === STRUCTURE_ROAD;
          }
          default : {
            return true;
          }
        }
      })
    })
    let capacity = 0;
    _.forEach(data, function(result){
      if(result){
        capacity++;
      }
    })
    return _.times(capacity, _.constant({
      assigned : false,
    }))
  }

  function isSafe(){
    //Search for dangerous things... I'm not sure what's dangerous now,
    //so we will need to update this
    const safeRange = 5;
    let safeData = util.lookAround(this, safeRange, function(tile){
      return _.every(tile, function(object){
        switch(object.type){
          case 'structure' : {
            return object.structure.structureType !== STRUCTURE_KEEPER_LAIR;
          }
          default : {
            return true;
          }
        }
      })
    })
    return _.every(safeData, Boolean);
  }

  return{
    init : init,
    isSafe : isSafe,
  }
}();