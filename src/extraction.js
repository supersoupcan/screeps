module.exports = {
  harvesterWorker : {
    resource: RESOURCE_ENERGY,
    weightedOrders: [{
      type: 'source',
      targetId: 'sourceId',
      method: Creep.prototype.harvest,
      addFilters : (source) => { return source.energy > 0}
    },
    {
      type: 'developedSource',
      targetId: 'containerId',
      method: Creep.prototype.transfer,
      addFilters: (container) => (container.store.energy > 0)
    },{
      type: 'container',
      targetId: 'containerId',
      method: Creep.prototype.transfer,
      addFilters: (container) => (container.store.energy > 0)
    }]
  }
}