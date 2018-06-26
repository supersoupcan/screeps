module.exports = {
  preset : {
    harvesterWorker : {
      resource: RESOURCE_ENERGY,
      weightedOrders: [{
        type: 'source',
        targetId: 'sourceId',
        method: Creep.prototype.harvest,
        addFilters : (source) => { return source.energy > 0}
      },
      {
        type: 'developedSource',
        targetId: 'containerId',
        method: Creep.prototype.transfer,
        addFilters: (container) => (container.store.energy > 0)
      },{
        type: 'container',
        targetId: 'containerId',
        method: Creep.prototype.transfer,
        addFilters: (container) => (container.store.energy > 0)
      }]
    }
  },
  provide : function(creep, extraction){
    const room = Game.rooms[creep.memory.ownedBy];
    let extractionSiteId = null;
    let finalOrderIndex = null;
    let previous = false;

    _.forEach(extraction.weightedOrders, (order, orderIndex) => {
      let eligibleSites = _.filter(room.memory[extraction.resource], function(siteMemory){
        const site = Game.getObjectById(siteMemory[order.targetId]);
        const ofType = siteMemory.type === order.type;
        if(ofType){
          const addFilters = order.addFilters(site);
          const isSafe = ('isSafe' in siteMemory) ? siteMemory.isSafe : false;
          return (ofType && addFilters && isSafe);
        }else{
          return false;
        }
      })

      let spaceIndex = -1;
      let finalSiteIndex = null;
      while(spaceIndex < 8 && !Boolean(extractionSiteId)){
        spaceIndex++;
        _.forEach(eligibleSites, (eligibleSiteMemory, eligibleSiteIndex) => {
          if(eligibleSiteMemory.spaces[spaceIndex] === creep.name){
            extractionSiteId = creep.memory.extractionSite.id;
            finalSiteIndex = creep.memory.extractionSite.index;
            previous = true;
            return false;
          }else if(eligibleSiteMemory.spaces[spaceIndex] === null){
            extractionSiteId = eligibleSiteMemory[order.targetId];
            finalSiteIndex = eligibleSiteIndex;
            return false;
          }
        })
      }

      if(Boolean(extractionSiteId)){
        finalOrderIndex = orderIndex;
        if(!previous){
          eligibleSites[finalSiteIndex].spaces[spaceIndex] = creep.name;
          _.forEach(room.memory[extraction.resource], (siteMemory, siteIndex) => {
            if(_.includes(siteMemory.spaces, (space) => space === creep.name)){
              let indexToDelete = _.findIndex(siteMemory.space, (space) => space === creep.name);
              siteMemory[indexToDelete] = null;
              return false;
            }
          });
        }
        return false
      }
    })

    return {
      index : finalOrderIndex,
      id : extractionSiteId,
    }
  }
}