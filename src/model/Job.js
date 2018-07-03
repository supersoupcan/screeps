function Job(logic, extraction, worksite){
  this.extraction = extraction;
  this.worksite = worksite;
  this.run = logic.run.bind(this);
  this.init = logic.init.bind(this);
}

Job.prototype = function(){
  const getters = {};
  const setters = {};
  
  function dismiss(creep){

  }

  const public = {
    dismiss : dismiss
  };
  
  return Object.assign({}, setters, getters, public);
}();

module.exports = Job;

