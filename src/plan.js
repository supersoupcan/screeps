const goal = require('goal');

module.exports = [
  {
    creeps : {},
  },
  {
    creeps : {
      worker : 4
    },
    goals : [
      goal.maintainEnergy,
      goal.maintainController,
      goal.upgradeController,
    ],
  },
  {
    creeps : {
      worker : 4
    },
    goals : [
      goal.maintainEnergy,
      goal.maintainController,
      new goal.BuildConstructionSites(STRUCTURE_EXTENSIONS, 5),
      new goal.BuildConstructionSites(STRUCTURE_ROAD, 4),
      goal.upgradeController,
    ]
  }
]