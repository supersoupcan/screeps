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
        job.HarvesterCarrier, {
        worker : 1,
      }),
      new goal.MaintainController(
        job.HarvesterUpgrader, {
        worker : 1,
      }),
      new goal.UpgradeController(
        job.HarvesterUpgrader, {
        worker : 1
      }),
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
        job.HarvesterCarrier, {
        worker : 1,
      }),
      new goal.MaintainController(
        job.HarvesterUpgrader, {
          worker : 1,
        }
      ),
      new goal.UpgradeController(
        job.HarvesterUpgrader, {
          worker : 1,
        }
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,{
          worker : 1,
        },
        STRUCTURE_CONTAINER
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,{
          worker : 1,
        },
        STRUCTURE_EXTENSION
      ),
      new goal.BuildSite(
        job.HarvesterBuilder,{
          worker : 1,
        },
        STRUCTURE_ROAD
      )
    ]
  }
]