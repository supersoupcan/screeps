## Ideas

Rooms are declared either Master or Resource.

Master Rooms have extensions, and processing facility and own/spawn their own creeps.
Resource Rooms are owned by specific Master Rooms and provide strategic Resource Extraction

Each Master Room has a development index (di) which determines how many creeps of each role to spawn.

The developmental index (di) also determines what the goals of those creeps are.

Goals have a dynmaic priority value from 1 to 10, which determines the order they are assigned based on the state of the room;

ex: this.goal["harvest"].priority will return a higher value if the extensions need energy;


Each job defines a loop between resource and worksite;

The resource determines that target resource which the job uses.
ex: job["harvester"].resource = RESOURCE_ENERGY;

The worksite determines where that resource is brought
ex. job["harvester"].worksite = STRUCTURE_SPAWN || STRUCTURE_EXTENSIONS;

Everytime a loop is completed (a resource is brought to a worksite), the creep checks the rooms goals again to see if a higher priority job is available;