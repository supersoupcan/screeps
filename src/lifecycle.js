module.exports = function(){
  function main(){
    manageRooms();
    manageCreeps();
  }

  function manageRooms(){
    _.forEach(Game.rooms, (room, roomName) => {
      
    })
  };

  function manageCreeps(){
    _.forEach(Game.creeps, (creep, creepName) => {
      
    })
  }

  return{
    main : main,
  }
}