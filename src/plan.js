const goal = require('goal');
const role = require('role');

module.exports = [
  {
    creeps : [],
    goals : [],
  },
  {
    creeps : [{
      type : role.worker,
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
      type : role.worker,
      amount : 4,
    }],
    goals : [
      new goal.MaintainEnergy(),
      new goal.MaintainController(),
      new goal.UpgradeController(),
      new goal.BuildSite(STRUCTURE_EXTENSION, _.constant(4)),
      new goal.BuildSite(STRUCTURE_ROADS, _.constant(4))
    ]
  }
]