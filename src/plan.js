const goal = require('goal');
const role = require('role');
const job = require('job');

module.exports = [
  {
    creeps : [],
    goals : [],
  },
  {
    creeps : [{
      role : role.worker,
      amount : 4,
    }],
    goals : [
      new goal.MaintainEnergy(
        job.HarvesterCarrier
      ),
      new goal.MaintainController(
        job.HarvesterUpgrader
      ),
      new goal.UpgradeController(
        job.HarvesterUpgrader
      ),
    ],
  },
  {
    build : [

    ],
    creeps : [{
      role : role.worker,
      amount : 4,
    },
    {
      role : role.carrier,
      amount : 0,
    }
  ],
    goals : [
      new goal.MaintainEnergy(
        job.HarvesterCarrier,
      ),
      new goal.MaintainController(
        job.HarvesterUpgrader,
      ),
      new goal.UpgradeController(
        job.HarvesterUpgrader
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,
        STRUCTURE_CONTAINER
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,
        STRUCTURE_EXTENSION
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,
        STRUCTURE_ROAD
      )
    ]
  }
]