// GLOBAL TODO
  // take action if see more then 500 entries (restrictions!)
  // throw error if levels < 2


/*
--------------------------------------------------------------------
  _                            _               
 | |                          | |              
 | |     __ _ _   _ _ __   ___| |__   ___ _ __ 
 | |    / _` | | | | '_ \ / __| '_ \ / _ \ '__|
 | |___| (_| | |_| | | | | (__| | | |  __/ |   
 |______\__,_|\__,_|_| |_|\___|_| |_|\___|_|   
                                               
                                               
--------------------------------------------------------------------
*/

function setDv()
{
  
  // Done:
    // sort data   
    // + make data object: SetsDV
    // + advance iniSheet
      // + set header rows + columns [optional]
      // + set file ids [optional]
    // write settings to user props
    // make first DV rule 
    // launch onEdit trigger
 
  
  // get settings:
  var settings = getDvSettings();
  /* 
    settings =     
    {
      namesWork=[Work Sample], 
       file=Spreadsheet, 
       rowsHeader=[5.0], 
       columns=[[1,2,3,5]], 
       idsSource=[1W2M_SardPuzPI5zX5ByTvrSZmls313RSCD80Z2fhL18], 
       namesData=[Data Sample]
     }                                                   
  */

  // get settings.
  var Sets = new SetsDV(settings); 
  
  // settings.namesWork, settings.namesData, settings.idsSource, settings.rowsHeader, settings.columns);
  
  // save this settings to PropertiesService
  setUserProperty(JSON.stringify(Sets), C_USER_PROPERTY_DV); // getUserProperty(C_USER_PROPERTY_DV);
  Logger.log(getUserProperty(C_USER_PROPERTY_DV));
  
  
  // make first DV rules for sheets with data.
  makeFirstDvRules(Sets);
  
  // write and set onEdit trigger
  setTriggerOnEdit('dvOnEdit');
    

}













/*
--------------------------------------------------------------------
   _____      _         ______             _            
  / ____|    | |       |  ____|           (_)           
 | (___   ___| |_ ___  | |__   _ __   __ _ _ _ __   ___ 
  \___ \ / _ \ __/ __| |  __| | '_ \ / _` | | '_ \ / _ \
  ____) |  __/ |_\__ \ | |____| | | | (_| | | | | |  __/
 |_____/ \___|\__|___/ |______|_| |_|\__, |_|_| |_|\___|
                                      __/ |             
                                     |___/              
--------------------------------------------------------------------
*/

function test_getSets()
{
  var namesWork = ['Work Sample'];
  var namesData = ['Data Sample'];
  
  var sets = new SetsDV(namesWork, namesData, ['1W2M_SardPuz...13RSCD80Z2fhL18']); // all data sheets are in current file
  
  Logger.log(JSON.stringify(sets));
  
  return sets;

}
/* SetsDV
  
  main object
  contains
    w: work sheets with their connections
    d: data sheets 

  result:
  
  {"w":
    {"Work":
      {"0data":{"r":5,"c":[1,2,3,5]}}},
   "d":
     {"0data":
       {"n":"data",
       "d":
         {"Earth":
           {"Europe":{
             "Britain":["London","Manchester","Liverpool"],
             "France":["Paris","Lion"],
             "Italy":["Rome","Milan"],
             "Greece":["Athenes"]
            },
           "Asia":{"China":["Pekin"]},
           ...},
        "h":["Planet","Mainland","Country","City"],
        "l":4,
        "f":0}}}
        
   ↓
  .........................................    
  * d - set of data sheets
  * w - set of work sheets
  
    * 0data is key of the connection
     * 0 - id of Spreadsheet. 0 means data is in current file
     * data - name of sheet with data
    Single work sheet may contain multiple DV rules.
    Script will check them all.


*/
function SetsDV(settings, sortedDataSets)

// settings:
//   namesWork, namesData, idsFileData, rowsHeader, columnsList
//                         ^^^^^^^^^^^^^ Optional ^^^^^^^^^^^^^ 
{

  namesWork = settings.namesWork;
  namesData = settings.namesData; 
  idsFileData = settings.idsSource;
  rowsHeader = settings.rowsHeader;
  columnsList = settings.columns;

  // number of connections set
  var l = namesWork.length;
  
  // if optional arrays are omited
  if (!idsFileData) { idsFileData = getFilledArray(false, l); }
  if (!rowsHeader) { rowsHeader = getFilledArray(false, l); }
  if (!columnsList) { columnsList = getFilledArray(false, l); }  
  
  
  var self = this;

  var sheetsWork = {};  // object of work sheets
  var sheetsData = {};  // object of data sheets
  
  var sheetWork = {};  // object for connections of current work sheet
                       // ↓↑ they have same id = keyData
  var sheetData = {};  // object for data of current work sheet
  
  var fData; // file with data sheet
  
  var keyWork = '';
  var keyData = '';
  var nameData = '';
  var idFileData = '';
  
  // loop all connections
  for (var i = 0; i < l; i++)
  {
    // sheet
      keyWork = namesWork[i];
      if (!(keyWork in sheetsWork)) sheetsWork[keyWork] = {}; // connections inside
      sheetWork = sheetsWork[keyWork]; 
    
    // data sheet
      idFileData = idsFileData[i] || '0'; 
      // zero if file = this file
      if (idFileData == SpreadsheetApp.getActive().getId()) idFileData = '0';
      nameData = namesData[i];
      keyData = idFileData + nameData;
      
      if (!(keyData in sheetsData))
      {
        // get file if it is another file
        if (idFileData == '0') { fData = SpreadsheetApp.getActive(); }
        else { fData = SpreadsheetApp.openById(idFileData); }      
        // get data                
        sheetsData[keyData] = new SheetData(nameData, idsFileData[i], rowsHeader[i], columnsList[i]);      
      }
      sheetData = sheetsData[keyData];
      
    // connection 
      if (!(keyData in sheetWork))
      {
        // create new connection
        sheetWork[keyData] = getConnection(keyWork, sheetData.h);
        //                                 ^ sheetName   ^ headers   
      }  
  }
  
  this.w = sheetsWork;
  this.d = sheetsData;

}

/*
  USAGE
  var result = getFilledArray(false, 5)
  
  RESULT
  [false, false, false, false, false]

*/
function getFilledArray(value, l)
{
    var result = [];
    // set idsFileWork to false
    for (var i = 0; i < l; i++)
    {
      result.push(value);    
    } 
  return result;
}

function test_getConnection()
{
  var connections = {};
  var nameSheet = 'Work Sample';
  var headers = ["Planet", "Mainland", "Country", "City"];
  connections['0data'] = getConnection(nameSheet, headers);
  Logger.log(JSON.stringify(connections));

}

/* 
  * nameSheet -- sheet with DV
  * headers   -- ["Planet", "Mainland", "Country", "City"]
  
  output =  {"r":5,"c":[1,2,3,5]}
  
  ↓
  
  r - rowHeader
  c - columns
  .........................................................
  If you do not include rowHeader and columns, script finds
  them by column names in [headers]

*/
function getConnection(nameSheet, headers, rowHeader, columns)
{
  //  "Sht_1": {
  //    "sName": "Sht_1",
  //    "nHeaderRow": 3,
  //    "columnsToUse": [1, 2]
  //  } 
  
  // ↓
  
  //  "Sht_1": {
  //    "n": "Sht_1",
  //    "r": 3,
  //    "c": [1, 2]
  //  }  
  
  var connection = {}; // data validation rules
  
  if (rowHeader && columns)
  {
    connection.r = r;
    connection.c = c;  
    return connection;
  }
  

    // sheets with DV are always in this book
    // because we install onEdit trigger here
    var file = SpreadsheetApp.getActiveSpreadsheet(); 
    var sheet = file.getSheetByName(nameSheet);    
    var data = sheet.getDataRange().getValues();
    
    // iterate sheet data, look for columns
    var row = [];
    var N = headers.length;
    var val = '';
    var index = 0;
    var c = []; // number of columns to match data validation
    var r = 0; // number of row with headers
    for (var i = 0, l = data.length; i < l; i++)
    {
      row = data[i];
      // iterate headers, try to find all of them
      c = [];
      for (var n = 0; n < N; n++)
      {
        index = row.indexOf(headers[n]) + 1;
        if (index == 0) break;
        c.push(index);
        if (n == N - 1)
        {
          // got them!
          r = i + 1;
          connection.r = r;
          connection.c = c;
          return connection;        
        }
      }    
    }
    
    return -1; // bad value, headers are not found. Have to return error
  
}

function test_sheetData()
{
  // pass sheet name and id file ('1W2M_SardPu....3RSCD80Z2fhL18')
  // may omit id file if this is native file
  
  var idFile = '1W2M_SardPuzP...0Z2fhL18';
  var shtData = new SheetData('Data Sample', idFile); 
  
  Logger.log(JSON.stringify(shtData));

}
/*  SheetData

  USAGE
    var iData = new SheetData('Data Sample', false);
    ................................................
    idFile is this file's if false
  
  object contains data from data sheet
  in form of tree
  
  result:
  
   {"n":"Data Sample",
   "d":
         {"Earth":
           {"Europe":{
             "Britain":["London","Manchester","Liverpool"],
             "France":["Paris","Lion"],
             "Italy":["Rome","Milan"],
             "Greece":["Athenes"]
            },
           "Asia":{"China":["Pekin"]},
           ...}
   "h":["Planet","Mainland","Country","City"],
   "l":4,
   "s":">",
   "f":0}
   
    ↓
    
    n - name
    d - data
    h - headers
    l - levels
    s - delimeter
    
    Usage of delimeter: 
      delimeter = '>';
      selectedItem = 'Earth>Asia>China'
      nextItem = findNextItem(selectedItem.split(delimeter));

*/
function SheetData(nameSheet, idFile)
{

  var self = this;
  self.n = nameSheet;
  
  idFile = idFile || SpreadsheetApp.getActiveSpreadsheet().getId(); // default is 0
  
  // idFile -- file Id of sheet with Data
  var file = SpreadsheetApp.openById(idFile);
  var sheet = file.getSheetByName(self.n);
  
  if (sheet === null) throw C_CUSTOM_ERROR_KEY + ": No sheet called '" + self.n + "'. Please review your settings." + " ... You may find this in a script by key: '" + C_CUSTOM_ERROR_KEY + ". Error #1'";
        
  // get & sort the data
  var range = sheet.getDataRange();
  var data = getSmartSort(range.getDisplayValues());
  // save sorted data if user wants the data to be sorted
  range.setValues(data); 
  
  self.d = getDvData(data); // function returning object
  self.h = data[0]; // TODO: find headers in some smarter way
  self.l = data[0].length;
  
  // get Delimeter (splitter / separator)
  self.s = getDelimeter(data, C_DELIMETERS)
  
  // is data source is in this file, write zero
  if (idFile == SpreadsheetApp.getActiveSpreadsheet().getId()) idFile = 0;
  self.f = idFile;  
  
  return 0;  
  
}


function test_getDelimeter()
{
  var delimeters = C_DELIMETERS; // ['→','>','=>', '->', '-->', '>>', '→→', '|', ' |'];
  var data = [['One', 'Two', 'Fri']];
  
  Logger.log(getDelimeter(data, C_DELIMETERS)); // → 
  
  data[0].push(delimeters[0]);
  
  Logger.log(getDelimeter(data, C_DELIMETERS)); // >
  
  // test recursive way
  data[0].push(delimeters.join(''));    
  Logger.log(getDelimeter(data, C_DELIMETERS)); // (1)
  
  
  // test recursive way 2
  data[0].push('(1)');
  data[0].push('(2)'); 
  Logger.log(getDelimeter(data, C_DELIMETERS)); // (3) 


}
/*
  USAGE:
    getDelimeter(data, delims)
    ...........................
    Do not include <indexOfTry>
  
  
  data
  [
    [boom, bam, 200, hoi],
    [goal, key, 150, way],
    [→→=>, (1), 0.0, goo]
  ]
  
  delims: ['>', '=>', '->', '>>', '|', ' |', '-->', '>>>']
  Put prefered delims in first place
  
  
  Output: -> 
  First symbol sequence from list that do not match any symbol sequence from data.
  
*/
function getDelimeter(data, delims, indexOfTry)
{

  var delimeters = JSON.parse(JSON.stringify(delims)); // make copy, not change origins
  var row = [];
  var val = '';
  var delim = '';
  if (indexOfTry >= 0)
  {   
    delimeters.push('(' + indexOfTry + ')'); // try this string 
    indexOfTry++;
  } 
  
  for (var i = 0, l = data.length; i < l; i++)
  {
    row = data[i];
    for (var j = 0, k = row.length; j < k; j++)
    {
      // loop delimeters
      val = row[j];
      for (var del = delimeters.length - 1; del >= 0; del--)
      {
        delim = delimeters[del]; 
        if (val.indexOf(delim) > -1) { delimeters.splice(del, 1); }        
      }     
    }  
  }
  if(delimeters && delimeters.length){   
   // not empty 
   return delimeters[0]; // return first found delimeter
  } else {
     // empty
     if (!indexOfTry) { indexOfTry = 1; }
     return getDelimeter(data, delimeters, indexOfTry); // go recursive
  }



}




/*
--------------------------------------------------------------------
  _____        _          ______             _            
 |  __ \      | |        |  ____|           (_)           
 | |  | | __ _| |_ __ _  | |__   _ __   __ _ _ _ __   ___ 
 | |  | |/ _` | __/ _` | |  __| | '_ \ / _` | | '_ \ / _ \
 | |__| | (_| | || (_| | | |____| | | | (_| | | | | |  __/
 |_____/ \__,_|\__\__,_| |______|_| |_|\__, |_|_| |_|\___|
                                        __/ |             
                                       |___/              
--------------------------------------------------------------------
*/
function test_getDvData()
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Sample'); // Data2  ||   Data Sample
  var data = sheet.getDataRange().getValues();
  
  
  // get object for cuttent DDLR
  var info = getDvData(data);
  Logger.log(JSON.stringify(info));
  
}

/*
  DvData.h = "headers": ["Planet", "Mainland", "Country", "City"]
  
  {"Earth":
    {"Europe":{
      "Britain":["London","Manchester","Liverpool"],
      "France":["Paris","Lion"],
      "Italy":["Rome","Milan"],
      "Greece":["Athenes"]
    },
    "Asia":{"China":["Pekin"]},
      ...}   
  

*/
function getDvData(data)
{
  var result = {};
  var node = {};
  var nextNode = {};
  var key = '';
  var value
  var w = data[0].length;
  var finalVal = '';
  
  // rows
  for (var i = 1, l = data.length; i < l; i++)
  {
    key = data[i][0];
    finalVal = data[i][w - 1];
    // num levels 3+
    if (w > 2)
    {         
       node = result[key] || {};
       nextNode = node;
      // columns
      for (var ii = 1; ii < w - 2; ii++) // exclude last column
      {
        value = data[i][ii];
        node[value] = node[value] || {};
        
        node = node[value];                 
      } 
      
      value = data[i][w - 2];
      node[value] = node[value] || [];
      node = node[value];
      node.push(finalVal);
             
    }
    else
    {
      nextNode = result[key] || [];
      nextNode.push(finalVal);    
    }
    
    result[key] = nextNode; 
  
  }
  

  return result;

}



