const goal = require('goal');
const role = require('role');

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
      new goal.MaintainEnergy(),
      new goal.MaintainController(),
      new goal.UpgradeController(),
    ],
  },
  {
    creeps : [{
      role : role.worker,
      amount : 4,
    }],
    goals : [
      new goal.MaintainEnergy(),
      new goal.MaintainController(),
      new goal.UpgradeController(),
      new goal.BuildSite(STRUCTURE_EXTENSION, _.constant(4)),
      new goal.BuildSite(STRUCTURE_ROAD, _.constant(4))
    ]
  }
]