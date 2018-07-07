module.exports = function(){
  function lookAround(range, iterator){
    const results = [];
    _.forEach(this.room.lookAtArea(
      this.pox.y - range,
      this.pos.x - range,
      this.pos.y + range,
      this.pos.x + range,
      false), 
      function(yPos){
        _.forEach(yPos, function(yPosXPos){
          results.push(iterator(yPosXPos)
        );
      })}
    );
    return results;
  }

  function isSafe(range){
    return _.every(lookAround.call(
      this, range || 5, (position) => _.every(position, (positionObject) => {
        switch(positionObject.type){
          case 'structure' : {
            return positionObject.type 
          }
        }
      })
    ), Boolean);
  }

  function availableSpace(range){
    let count = 0;
    lookAround.call(this, range || 1, (tile) => {
      const available = _.every(tile, (positionObject) => {
        switch(positionObject.type){
          case 'creep' : {
            return true;
          }
          default : {
            return !_.includes(positionObject[positionObject.type], OBSTACLE_OBJECT_TYPES);
          }
        }
      })
      if(available) count++;
    })
    return count;
  }

  return {
    isSafe : isSafe,
    lookAround : lookAround,
    availableSpace : availableSpace,

  }
}();