module.exports = {
  lookAround : function(roomObject, range, iterator){
    const data = roomObject.room.lookAtArea(
      roomObject.pos.y - range,
      roomObject.pos.x - range,
      roomObject.pos.y + range,
      roomObject.pos.x + range,
      false
    );
  
    let results = [];
    _.forEach(data, function(yPos){
      _.forEach(yPos, function(yPosXPos){
        results.push(iterator(yPosXPos));
      })
    });
  
    return results;
  }
}