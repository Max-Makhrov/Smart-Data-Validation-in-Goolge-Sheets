

function test_uniqueArray()
{
  var ar = ['boo', '1', 1, 'true', true]; // [boo, 1, 1.0, true, true]
  Logger.log(getUniqueLine(ar));
  
  ar = [[5],[3,5],[5],[3,5],[5],[3,5]];
  Logger.log(getUniqueLine(ar));
}

function getUniqueLine( ar ) {
  var j = {};

  ar.forEach( function(v) {
    j[v+ '::' + typeof v] = v;
  });

  return Object.keys(j).map(function(v){
    return j[v];
  });
} 


function test_getUniquePairs()
{
  var pairs = 
  [
    ['one', 'two', 'fri', 'fri'],
    [    1,     2,     3,     3]  
  ];
  Logger.log(getUniquePairs(pairs)); // [[one, 1.0], [two, 2.0], [fri, 3.0]]
}

function getUniquePairs(pairs)
{
   var array = transpose(pairs);
   return getUniqueLine(array);
}