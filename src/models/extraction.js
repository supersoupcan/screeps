function Provider(type, target, method, filter){
  this.type = type;
  this.data = {
    target : target,
    method : method,
    filter : filter,
  }
}

Provider.prototype = function(){

}();

const transferDevelopedSource = new Provider(
  'developedSource', 'container', 
  Creep.prototype.transfer,
  (container) => container.store.energy > 0
)

const harvestSource = new Provider(
  'source', 'source',
  Creep.prototype.harvest,
  (source) => source.energy > 0
)

const transferContainer = new Provider(
  'container', 'container', 
  Creep.prototype.transfer,
  (container) => container.store.energy > 0
)

const Extraction = function(resource, providers){
  this.resource = resource;
  this.providers = {};
  this.priority = [];
  _.forEach(providers, (provider) => {
    this.providers[provider.type] = provider.data;
    this.priority.push(provider.type);
  })
}

Extraction.prototype = function(){
  function findPriority(type){
    return _.findIndex(this.priority, (priorityType) => {
      return (type === priorityType);
    })
  }

  function remove(creep){
    const type = creep.memory.job.extraction.type;
    _.forEach(
      creep.owner.getProviders(this.resource, type),
      (provider) => {
        const index = provider[type].spaces.findIndex(
          (assignment) => assignment.creepName === creep.name
        )
        if(index !== -1){
          provider[type].spaces.splice(index, 1);
        }
      }
    )
  }

  function provide(creep){
    const room = creep.owner;
    let complete = false;

    _.forEach(this.priority, (type, priorityIndex) => {
      const targetAssignmentMemory = {
        creepName : creep.name
      }

      const targets = room.getExtractionTargets(
        this.resource, 
        this.providers[type]
      )

      _.forEach(targets, (target) => {
        const creepExtractionMemory = {
          type : type,
          targetId : target.id,
        }

        if(_.includes(target.assignments, creep.name)){
          //already assigned to relevent works
        }else if(target.assignments.length < target.limit){
          target.assignments.push(targetAssignmentMemory);
          creep.extraction = creepExtractionMemory;
          complete = true;
        }else if(target.limit === target.assignments.length){
          _.forEach(target.assignments, (assignment) => {
            const creepToOverride = Game.creeps[assignment.creep];
            if(creepToOverride.job.extraction.findPriority(type) > priorityIndex){
              creepToOverride.extraction = null;
              assignment = targetAssignmentMemory;
              creep.extraction = creepExtractionMemory;
              complete = true;
              return false;
            }
          })
        }
        if(!complete){
          return false;
        }
      });
      if(complete){
        return false;
      }
    });
  }


  return {
    provide : provide,
    remove : remove,
    findPriority : findPriority,
  }
}();

const workerEnergy = new Extraction(RESOURCE_ENERGY, [
  transferDevelopedSource,
  harvestSource,
  transferContainer,
]);

const haulerEnergy = new Extraction(RESOURCE_ENERGY, [
  transferDevelopedSource,
  transferContainer,
])

module.exports = {
  workerEnergy : workerEnergy,
  haulerEnergy : haulerEnergy,
}