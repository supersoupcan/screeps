module.exports = function(){
  function init(){
    _.forEach(this.find(FIND_SOURCES), function(source){
      source.init();
    })
  }

  function provideWorkSite(type){
    //
  }

  function provideSource(){
    //
  }

  return{
    init : init,
    provideWorkSite : provideWorkSite,
    provideSource : provideSource
  }
}();