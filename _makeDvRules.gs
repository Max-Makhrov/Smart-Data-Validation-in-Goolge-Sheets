function makeFirstDvRules(Sets)
{
/*
{"w":{"Work Sample":
  {"0Data Sample":{"r":5,"c":[1,2,3,5]}}},
  "d":{"0Data Sample":
  {"n":"Data Sample","d":{"Earth":{"Europe":{"Britain":["London","Manchester","Liverpool"],"France":... }}},
  "h":["Planet","Mainland","Country","City"],
  "l":4,
  "s":">",
  "f":0
 }}}
*/


  var sheets = Sets.w;
  var namesSheet = Object.keys(sheets);
  var nameSheet = '';
  var dataSet = {};
  var objSheet = {};
  var objConnection = {};
  var namesConnection = [];
  var nameConnection = '';

  for (var i = 0, l = namesSheet.length; i < l; i++)
  {
    nameSheet = namesSheet[i]; // Work
    objSheet = sheets[nameSheet]; // {0Data Sample={r=5.0, c=[1.0, 2.0, 3.0, 5.0]}}   =>    {0Data2={r=1.0, c=[1.0, 2.0, 3.0]}}
    namesConnection = Object.keys(objSheet); // [0Data Sample] => [0Data2]
    
    for (var j = 0, k = namesConnection.length; j < k; j++)
    {
      nameConnection = namesConnection[j]; // 0Data Sample  =>   0Data2
                 
      objConnection = objSheet[nameConnection]; // {r=5.0, c=[1.0, 2.0, 3.0, 5.0]}     =>     {r=1.0, c=[1.0, 2.0, 3.0]}
      dataSet = Sets.d[nameConnection];
      var range = getFirstDvRuleRange(nameSheet, objConnection);
      var noteChain = ""; // first rule has no note
      var list = getDvRuleList(dataSet, noteChain); 
      makeDvFromList(range, list, noteChain);
    }
  }  

}

function getFirstDvRuleRange(nameSheet, objConnection)
{
  /*
    nameSheet     'Work Sample'
    objConnection {"r":5,"c":[1,2,3,5]}
  */
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName(nameSheet);  

  var rows = sheet.getMaxRows();
  var row = objConnection.r + 1;
  var column = objConnection.c[0];
  var numRows = rows - row + 1;
  
  var range = sheet.getRange(row, column, numRows);  
  
  return range;
}






function test_getDvRuleList()
{
  var dataSet =   
       {"n":"data",
        "d":{"Earth":{
                "Europe":{"Britain":["London","Manchester","Liverpool"],
                      "France":["Paris","Lion"],
                      "Italy":["Rome","Milan"],
                      "Greece":["Athenes"]},
                "Asia":{"China":["Pekin"]},
                "Africa":{"Algeria":["Algiers"]},
                "America":{"USA":["Dallas","New York","San Francisco","Chicago"]}},
                "Tatooine":{"Yulab":{"Putesh":["ASU","Niatirb"],"Zalip":["Duantan"]},"Asia":{"Solo":["Lion","To"]}}},
        "h":["Planet","Mainland","Country","City"],
        "l":4,
		"s":">",
        "f":0};
   
   
   
   // last level
   var noteChain = "Earth>Europe>France>Paris";
   Logger.log(getDvRuleList(dataSet, noteChain)); // [Paris, Lion]
   
   // normal case   
   var noteChain = "Earth>Europe>France";
   Logger.log(getDvRuleList(dataSet, noteChain)); // [Paris, Lion]
   var noteChain = "Earth";
   Logger.log(getDvRuleList(dataSet, noteChain)); // [Europe, Asia, Africa, America]
   var noteChain = "Earth>Europe";
   Logger.log(getDvRuleList(dataSet, noteChain)); // [Britain, France, Italy, Greece]
   var noteChain = "";
   Logger.log(getDvRuleList(dataSet, noteChain)); // [Earth, Tatooine]  
   
   // bad values
   var noteChain = "Booooooo";
   Logger.log(getDvRuleList(dataSet, noteChain)); // null   
   var noteChain = "Earth>Boooooooooo";
   Logger.log(getDvRuleList(dataSet, noteChain)); // null
   var noteChain = "Earth>Europe>France>Paris>Rue";
   Logger.log(getDvRuleList(dataSet, noteChain)); // null
   var noteChain = ">>>>>>>>>>>>>>>>>>>>>>>>";  
   Logger.log(getDvRuleList(dataSet, noteChain)); // null

}



function getDvRuleList(dataSet, noteChain)
{
/* 
  dataSet       
       {"n":"data",
        "d":{"Earth":{
                "Europe":{"Britain":["London","Manchester","Liverpool"],
                      "France":["Paris","Lion"],
                      "Italy":["Rome","Milan"],
                      "Greece":["Athenes"]},
                "Asia":{"China":["Pekin"]},
                "Africa":{"Algeria":["Algiers"]},
                "America":{"USA":["Dallas","New York","San Francisco","Chicago"]}},
                "Tatooine":{"Yulab":{"Putesh":["ASU","Niatirb"],"Zalip":["Duantan"]},"Asia":{"Solo":["Lion","To"]}}},
        "h":["Planet","Mainland","Country","City"],
        "l":4,
		"s":">",
        "f":0};

  noteChain 
    ""                      for the first level it will be empty string
    "Earht>Europe>France"   for next levels it is chain of previous values + current value
                            "Earht>Europe" = values pre-entered
                            "France"       = value entered to currently being checked range
*/


  
  if (noteChain === "") return Object.keys(dataSet.d);
  
  var chain = noteChain.split(dataSet.s);
  
  var levelSet = chain.length;  
  
  // checks
  if (levelSet > dataSet.l) { return null; }
  if (levelSet === dataSet.l) { levelSet--; } // for the last level -> return same list
  
  var objLook = dataSet.d; 
  if (typeof objLook === "undefined") { return null; } // error, wrong value
  for (var i = 0; i < levelSet; i++) { objLook = objLook[chain[i]]; }  
  if (Array.isArray(objLook)) { return objLook; }
  if (typeof objLook === "undefined") { return null; } // error, wrong value;
  return Object.keys(objLook);
}






