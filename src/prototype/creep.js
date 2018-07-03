module.exports = function(){
  const setters = {
    set role(role){
      this.memory.role = role;
    },
    set ownerId(ownerId){
      this.memory.ownerId = ownerId;
    },
    set job(job){
      this.memory.job = job;
    },
    set goal(goal){
      this.memory.goal = goal.name;
    }
  };
  
  const getters = {
    get role(){
      return this.memory.role;
    },
    get goal(){
      return this.memory.goal;
    },
    get ownerId(){
      return this.memory.ownerId;
    },
    get job(){
      return goals[this.memory.goal][this.memory.role].job
    },
    get owner(){
      return Game.rooms[this.ownerId]
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

  return Object.assign({}, setters, getters, public);
}();