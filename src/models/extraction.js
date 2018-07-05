function Provider(type, target, method, filter){
  this.type = type;
  this.data = {
    target : target,
    method : method,
    filter : filter,
  }
}

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

const developedHarvestSource = new Provider(
  'developedSource', 'source',
  Creep.protoype.harvest,
  (source) => source.energy > 0
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

  function dismissCreep(creep){
    const type = creep.memory.job.extraction.type;
    _.forEach(
      _.filter(
        creep.owner.memory.extraction[this.resource],
        (extractionMemory) => extractionMemory.type === type
      ),
      (extractionMemory) => {
        const index = extractionMemory.spaces.findIndex(
          (assignment) => assignment.creepName === creep.name
        )
        if(index !== -1){
          extractionMemory[type].spaces.splice(index, 1);
          creep.memory.job.extraction = null;
          break;
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
    dismissCreep : dismissCreep,
    findPriority : findPriority,
  }
}();

module.exports = {
  workerEnergy : new Extraction(RESOURCE_ENERGY, [
    harvestSource, transferDevelopedSource, transferContainer,
  ]),
  haulerEnergy : new Extraction(RESOURCE_ENERGY, [
    transferDevelopedSource, transferContainer
  ]),
  harvesterEnergy : new Extraction(RESOURCE_ENERGY, [
    developedHarvestSource
  ])
}


/*
Extraction 
  the extraction object describes how creeps of certian jobs will be assigned
  resources on the map. Typically, an extraction object specifices which resource to use,
  and how to interact with that resource through different types of providers.
  
  Provider are simple objects which describe a type of resource area on the map
  and how a creep of a given role should interact with that resource area. The
  most important task, is telling the role how to find the id information of a given target
  object in that resource processsing area.

  For Example:
    the resource area denoted as 'developedSource' contains two target objects,
    namely, the source being mined and the container being drop mined into. 

  This design allows for a more flexible and looplike approach to jobs, denotated by the
  job.logic.standard property.

*/
