/*
--------------------------------------------------------------------
  _______        _       
 |__   __|      | |      
    | | ___  ___| |_ ___ 
    | |/ _ \/ __| __/ __|
    | |  __/\__ \ |_\__ \
    |_|\___||___/\__|___/                         

--------------------------------------------------------------------                            
*/

function test_cellsProps() {
  var file = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = file.getSheetByName('Sheet1');
  var range = sheet.getRange(1, 1);
  
  Logger.log(range.getDataSourceUrl()); // https://docs.google.com/spreadsheets/d/t_CIvodWyRvZR-t7a5ZN7Qw/gviz/tq?headers=-1&transpose=0&merge=rows&gid=0&range=A1
  // Logger.log(range.getDataTable()); // for charts
  Logger.log(range.getGridId()); // 0.0 -- Returns the grid ID of the range's parent sheet.
  
// Log information about the data-validation rule for cell A1.
 var cell = range;
 var rule = cell.getDataValidation();
 if (rule != null) {
   var criteria = rule.getCriteriaType();
   var args = rule.getCriteriaValues();
   Logger.log('The data-validation rule is %s %s', criteria, args);
 } else {
   Logger.log('The cell does not have a data-validation rule.')
 }
  
}


function test_makeTestDataAndProps() {
  var sSheet = 'test_data';
  var l = 1000;
  
  // writeDataIntoSheet(false, sheet, data, 1, 1)
  
  var data = [];
  data.push(['Name', 'Sum']);
  
  var row = [];
  
  for (var i = 0; i < l; i++)
  {
    row = [];
    row.push('Name ' + i);
    row.push(parseInt(Math.random() * 10000));  
    data.push(row);
  }
    
  var tJson = JSON.stringify(data);
  

  var key = sSheet;
  
  var bSet = setUserProperty(tJson, key);
  Logger.log(bSet);
  
  var start = new Date();   
  if (bSet == 'Set Properties -- ok!') var result = getPropertyAsArray(key);
  Logger.log(new Date() - start); // 45  

  
}

function test_dataValidationCapacity()
{
  var file = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = file.getSheetByName('tooMuchData');
  
  var data = sheet.getDataRange().getValues();
  
  Logger.log(data);
  
  var cell = sheet.getRange('B1');
  
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(data, false).build();
  cell.setDataValidation(rule); // error: limin is 500 rows

}

function test_dataValidationRangeFromOtherSheet()
{
  
  
  var file = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = file.getSheetByName('tooMuchData');
  
  var range = sheet.getDataRange();
  
  
  var idFileOther = '1_CKplszLjCnuCj8B5r-xFww5Ys-SjL-qD6BEl7cr9CA';
  var fileOther = SpreadsheetApp.openById(idFileOther)
  var cell = fileOther.getSheetByName('Каталог').getRange('L3');
  
   var rule = SpreadsheetApp.newDataValidation().requireValueInRange(range, false).build();
   cell.setDataValidation(rule); // error: cannot do this,  "=tooMuchData!A1:A508" is invalid
}


function test_trigger()
{
 

 var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
 var status = authInfo.getAuthorizationStatus();
 var url = authInfo.getAuthorizationUrl();
 
 Logger.log(status);
 Logger.log(url);
 
 // get all google sheet files
 // 'application/vnd.google-apps.spreadsheet'
  var arr = [];
  var files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
  while (files.hasNext()) {
    file = files.next();
    arr.push([file.getName(), file.getUrl(), file.getDateCreated(), file.getLastUpdated()])
  }
  
  
 Logger.log(arr);

}


function test_getTournamentMatches()
{
  var teams = ['Brazil', 'USA', 'Argentina', 'Ukraine'];
  Logger.log(getTournamentMatches(teams));
  
  teams.push('Vietnam');
  Logger.log(getTournament_(teams));
  

}

function test_getTournament()
{
  var teams = [['Brazil'], ['USA'], ['Argentina'], ['Ukraine']];  
  Logger.log(getTournament(teams));
}


function getTournament(teams_from_range)
{
  // teams_from_range -- 2D Array  
  var teams = [];
  // convert to list
  teams_from_range.forEach(function(row) { row.forEach(function(cell) { teams.push(cell); } ); } );
  return getTournament_(teams);
}


function getTournament_(teams)
{
  var start = 0;
  var l = teams.length;
  var result = [], game = [];
  
  // loop each value
  for (var i = 0; i < l; i++)
  {
    // loop each value minus current
    start++;
    for (var ii = start; ii < l; ii++)
    {
      game = []
      game.push(teams[i]);
      game.push(teams[ii]);  
      result.push(game);
    }  
  }
  
  return result;

}

