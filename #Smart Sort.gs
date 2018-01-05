/*

  __  _____  _____ _____ 
 ((  ((   )) ||_//  ||   
\_))  \\_//  || \\  ||   

*/

function test_getSmartSort()
{
  var data = 
  [
    ['Earth', 'Europe', 'Britain', 'London'],
    ['Earth', 'Europe', 'Britain', 'Manchester'],
    ['Earth', 'Europe', 'Britain', 'Liverpool'],
    ['Earth', 'Europe', 'France', 'Paris'],
    ['Earth', 'Europe', 'France', 'Lion'],
    ['Earth', 'Europe', 'Italy', 'Rome'],
    ['Earth', 'Europe', 'Italy', 'Milan'],
    ['Earth', 'Europe', 'Greece', 'Athenes'],
    ['Earth', 'Asia', 'China', 'Pekin'],
    ['Earth', 'Africa', 'Algeria', 'Algiers'],
    ['Earth', 'America', 'USA', 'Dallas'],
    ['Earth', 'America', 'USA', 'New York'],
    ['Earth', 'America', 'USA', 'Chicago'],
    ['Tatooine', 'Yulab', 'Putesh', 'ASU'],
    ['Tatooine', 'Yulab', 'Putesh', 'Niatirb'],
    ['Tatooine', 'Yulab', 'Zalip', 'Duantan'],
    ['Tatooine', 'Asia', 'Solo', 'Lion'],
    ['Tatooine', 'Asia', 'Solo', 'To'],
    ['Earth', 'America', 'USA', 'San Francisco'], 
    ['Tatooine', 'Yulab', 'Koko', 'Traiwau'],
    ['Venus', 'Yoo', 'Van', 'Derzar'],
    ['Tatooine', 'Chendoo', 'org', 'Eccel']
  ];


  var result = getSmartSort(data);
  
  Logger.log(result);

}
/*



  Idea: analize square data
    1. count number of columns
    2. assume left most columns has higher priority: data is structuted
    3. try to save original sorting: take first rows first
    4. return sorted by values data, but not alphabet sorting. Do position sorting: first things go first
    
    
  Imput
    data      = 2d Array like sheet data
    delimeter = some unique string that not matches any array value 
    
*/
function getSmartSort(data)
{
  // orifinal code:
  // https://stackoverflow.com/a/46810934/5372400
  var hash = Object.create(null),
    result = data
    .map(function (a, i) {
      var temp = hash;
      return a.map(function (k) {
        temp[k] = temp[k] || { _: i };
        temp = temp[k];
        return temp._;
      });
    })
    .sort(function (a, b) {
      var value;
      a.some(function (v, i) {
        return value = v - b[i];
      });
      return value;
    })
    .map(function (indices) {
      return data[indices[indices.length - 1]];
    });
  
  return result;  
}