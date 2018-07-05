const lists = function(){
  const structuresMaintainEnergy = [
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN
  ]

  const structureBuildPriority = {
    STRUCTURE_EXTENSION : 0,
    STRUCTURE_SPAWN : 1,
    STRUCTURE_ROAD : 2,
  }

  return {
    structuresMaintainEnergy : structuresMaintainEnergy,
    structureBuildPriority : structureBuildPriority,
  }
}();

module.exports = lists;