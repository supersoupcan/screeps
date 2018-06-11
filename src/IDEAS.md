## Ideas

Rooms are declared either Master or Resource.

Master Rooms have extensions, and processing facility and own/spawn their own creeps.
Resource Rooms are owned by specific Master Rooms and provide strategic Resource Extraction

Each Master Room has a development index (di) Object in memory, which determines how many creeps of each role to spawn.

Each Master Room has an Goal Object in Memory which determines the current Goals. 

The developmental index (di) also determines what the goals of those creeps are at any given index;

Goals have a dynmaic priority value, which determines the order they are assigned based on the state of the room;

ex: goal.mantainEnergy.priority will return a higher value if the extensions need energy;

Create a Custom Goal Object,

A Goal Object tells the room it needs a specific job preformed/
A Goal Object has a method which determines goal priority.
A Goal Object tells the room if this job can be completed.
If a Goal can be completed, the Goal Object tells the room ( or creep?) when the goal has been completed;

Goal Object tells the creep and room what to do when the job is completed;

Goal Object takes an override function, which creates an override object in memory, which gets used to explicitly determine aspects of job behaviour.

ex: A build goals may want to specify a specific target to build, instead of allowing the job to dermine this automatically.

The job checks it's goals override method, before acting;

Each job defines a loop between resource and worksite;

The resource determines that target resource which the job uses.
ex: job["harvester"].resource = RESOURCE_ENERGY;

The worksite determines where that resource is brought
ex. job["harvester"].worksite = STRUCTURE_SPAWN || STRUCTURE_EXTENSIONS;

Everytime a loop is completed (a resource is brought to a worksite), the creep checks the rooms goals again to see if a higher priority job is available;