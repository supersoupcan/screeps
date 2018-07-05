module.exports = function(){
  const getters = {
    get role(){
      return roles[this.memory.role];
    },
    get job(){
      return goals[this.memory.goal][this.memory.role].job;
    },
    get owner(){
      return Game.rooms[this.memory.ownerId];
    },
  };

  function isFull(){
    return (_.sum(this.carry) === this.carryCapacity);
  }

  function has(resource){
    return (this.carry[resource] !== 0)
  }

  const public = {
    isFull : isFull,
    has : has,
  };

  return Object.assign({}, getters, public);
}();