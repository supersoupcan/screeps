## Ideas

Rooms are declared either Master or Resource.

Master Rooms have extensions, and processing facility and own/spawn their own creeps.
Resource Rooms are owned by specific Master Rooms and provide strategic Resource Extraction

Each Room has a development level Object in memory, which determines how many creeps of each role to spawn as well as the current goals.

Goals have a dynmaic priority value, which determines the order they are assigned based on the state of the room;

ex: goal.mantainEnergy.priority will return a higher value if the room's extensions need energy

A Goal Object tells the room it needs a specific job preformed

Goal Object tells the creep and room what to do when the job is completed;



Each ExtractorMover job defines a loop between a resource extraction location and a workSite.

The resource determines that target resource which the job uses.
ex: job["harvester"].resource = RESOURCE_ENERGY;

The worksite object populates a room.find query which returns an eligible worksite.

job["harvester'].workSite] = {
  find : FIND_MY_STRUCTURES,
  filter : function(structure){
    if(structure.type === STRUCTURE_EXTENSION || structure.type === STRUCTURE_SPAWN){
      return (structure.energy < structure.energyCapacity);
    }else{
      return false;
    }
  }
}

Everytime a loop is completed (a resource is brought to a worksite), the creep checks the rooms goals again to see if a higher priority job is available;