const standardMap = [
  [' ','O','O','O','O',' ','O','=','O',' ','O','O','O','O',' ',],
  ['O','O','=','=','O','O','O','=','O','O','O','=','=','O','O',],
  ['O','=','O','O','=','O','O','=','O','O','=','O','O','=','O',],
  ['=','O','O','O','O','=','O','=','O','=','O','O','O','O','=',],
  ['O','=','O','O','O','O','=',' ','=','O','O','O','O','=','O',],
  ['O','O','=','O','O','O','O','=','O','O','O','O','=','O','O',],
  [' ','O','O','=','O','O','O','=','O','O','O','=','O','O',' ',],
  [' ',' ','O','O','=','O','=','S','=','O','=','O','O',' ',' ',],
  [' ',' ',' ',' ',' ','=','S','=','S','=',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ','=',' ','=',' ',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ',' ','=',' ',' ',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',],
];
const standardLegend = {
  ' ': null,
  'O': {
    type : STRUCTURE_EXTENSION,
    round : 0,
  },
  '=': {
    type : STRUCTURE_ROAD,
    round : 0,
  },
  'S': {
    type : STRUCTURE_SPAWN,
    round : 0,
  }
};


let Base = function(legend, map){
  this.legend = legend;
  this.map = map;
  this.rotation = 0;
}

Base.prototype = function(){
  function planConstruction(room){
    console.log('setting construction sites ' + room.controller.level);

    let constructionData = {
      [STRUCTURE_EXTENSION] : {
        count : true,
      },
      [STRUCTURE_ROAD] : {
        count : false,
      },
      [STRUCTURE_SPAWN] : {
        count : true
      }
    }

    _.forEach(constructionData, (constructionTypeData, structureType) => {
      if(constructionTypeData.count === true){
        constructionTypeData.current = 0;
        constructionTypeData.max = CONTROLLER_STRUCTURES[structureType][room.controller.level];
      }
    })
    const spiralArr = spiralArrBuilder.call(this, this.size.width);

    _.forEach(spiralArr, (data, index) => {
      const construction = this.legend[this.map[data.y + 7][data.x + 7]];
      if(construction){
        const plan = constructionData[construction.type];
        if(!plan.count || plan.current < plan.max){
          let createSite = true;
          let addToCount = false;

          let roomX = room.memory.base.x + data.x;
          let roomY = room.memory.base.y + data.y;

          _.forEach(room.lookAt(roomX, roomY), (object) => {
            switch(object.type){
              case 'terrain' : {
                if(object.terrain === 'wall'){
                  createSite = false;
                }
                break;
              }case 'creep' : {
                if(!object.creep.my){
                  createSite = false;
                }
                break;
              }case 'structure' : {
                if(object.structure.structureType === construction.type){
                  addToCount = true;
                  createSite = false;
                }
                break;
              }case 'constructionSite' : {
                if(object.constructionSite.structureType === construction.type){
                  addToCount = true;
                  createSite = false;
                }
                break;
              }
            }
          })

          if(createSite){
            room.createConstructionSite(roomX, roomY, construction.type);
            addToCount = true;
          }

          if(addToCount && plan.count){
            plan.current += 1;
          }

          const complete = _.every(constructionData, (constructionTypeData, structureType) => {
            if(constructionTypeData.count === true){

              if(constructionTypeData.current === constructionTypeData.max){
                return true;
              }else{
                return false;
              }
            }
            return true;
          })
          if(complete){
            return false;
          }
        }
      }
    })
  }

  function rotate90degrees(){
    _.zip.apply(_, this.map);
    this.rotation = (this.rotation + 1) % 4;
  }

  function spiralArrBuilder(){
    const length = 15;
    let x = 0;
    let y = 0;
    let direction;
    let results = [];

    results.push({
      x : x,
      y : y
    });
  
    for(let i = 0; i < length; i++){
      direction = (i % 2) === 0 ? -1 : 1;
      for(let xOffset = 0; xOffset < i; xOffset++){
        x = x + direction;
        results.push({x : x, y : y});
      }
      for(let yOffset = 0; yOffset < i; yOffset++){
        y = y + direction;
        results.push({x : x, y : y});
      }
    }
    for(let xFlush = 0; xFlush < (length -1); xFlush++){
      direction *= -1;
      x = x + direction;
      results.push({x : x, y : y});
    }  
    return results
  }

  return {
    planConstruction : planConstruction,
    rotate90degrees : rotate90degrees,
    get size(){
      return {
        width : this.map[0].length,
        height : this.map.length,
      }
    },
  }
}();


const standard = new Base(standardLegend, standardMap);

module.exports = {
  standard : standard,
}
/*
function spiralSearch(length){
  let x = 0;
  let y = 0;
  let direction;
  let results = [[x, y]];

  for(let i = 0; i < length; i++){
    direction = (i % 2) === 0 ? -1 : 1;
    for(let xOffset = 0; xOffset < i; xOffset++){
      x = x + direction;
      results.push([x, y]);
    }
    for(let yOffset = 0; yOffset < i; yOffset++){
      y = y + direction;
      results.push([x, y]);
    }
  }
  for(let xFlush = 0; xFlush < (length -1); xFlush++){
    direction *= -1;
    x = x + direction;
    results.push([x, y]);
  }  
  console.log(results);
}

const emptyGrid = [
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
]
*/