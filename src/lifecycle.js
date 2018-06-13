module.exports = {
  manageRooms : function(){
    _.rooms(Game.rooms, (room, name) => {
      if(_.isEmpty(roomMemory)){
        room.init();
      }
    })
  }
}