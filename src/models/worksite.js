const Worksite = function(method, find){
  this.method = method;
  this.find = find;
};

Worksite.prototype = function(){
  function standardProcessing(results){
    if(results.length > 0){
      return results[0];
    }
  }

  function provideCreep(creep){
    const room = creep.owner;
    let worksite = {};
    if(_.isString(this.find)){
      worksite.id = room[this.find].id;
    }else{
      const filter = { filter : this.find.filter } || {};
      const process = this.find.process || standardProcessing;
      const results = room.find(this.find.keyword, filter);
      worksite.id = process(results).id;
    }
    return worksite;
  }

  function dismissCreep(creep){

  }

  return {
    provideCreep : provideCreep,
    dismissCreep : dismissCreep
  }
}();

const energyMaintenanceSite = new Worksite(
  Creep.prototype.transfer,
  {
    keyword :  FIND_MY_STRUCTURES,
    filter : function(structure){
      if(_.includes(lists.structuresMaintainEnergy, structure.structureType)){
        return (structure.energy < structure.energyCapacity);
      }
      return false;
    },
  }
);

const upgradeSite = new Worksite(
  Creep.prototype.upgradeController,
  STRUCTURE_CONTROLLER,
);

const buildSite = new Worksite(
  Creep.prototype.build,
  {
    keyword : FIND_MY_CONSTRUCTION_SITES,
    process : function(results){
      if(results.length > 0)
        const prioritized = _.sortBy(results, (site) => {
          return lists.buildPriority[site.structureType];
        })
        return prioritized[0];
    }
  }
);

module.exports = {
  energyMaintenanceSite : energyMaintenanceSite,
  upgradeSite : upgradeSite,
  buildSite : buildSite
};