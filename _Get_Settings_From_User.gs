
/* 

  __ __  __ _____ __ __ _____ 
  || ||\\|| ||_// || ||  ||   
  || || \|| ||    \\_//  ||     


  file -- this file
  
  var C_USER_SETTINGS_KEYS = ['Work Sheet', 'Data Sheet', 'Source File Id', 'Header Row', 'Columns']; // headers for sheet with settings
  
*/
function test_getDvSettings()
{
  Logger.log(getDvSettings());
}
/*
  Function returns settings in proper format
  ..........................................
  Settings is actually list of connections: <Data Sheet -- Work Sheet>, defined by user
  
  OUTPUT
    {namesWork  = [Work Sample], 
     file       = Spreadsheet, 
     rowsHeader = [5.0], 
     columns    = [[1, 2, 3, 5]], 
     idsSource  = [1W2M_SardPuzPI5zX5ByTvrSZmls313RSCD80Z2fhL18], 
     namesData  = [Data Sample]}
   
    
   ↓
   
   namesWork  - list of sheet's names
   file       - Spreadsheet file, saved here for future use
   rowsHeader - numbers of rows, detected by user, may contain false for auto-match
   columns    - columns for DV, detected by user, may contain false for auto-match
   idsSource  - file ids of data sheets of connections
   namesData  - list of data sheet's names


*/
function getDvSettings()
{
  var file = SpreadsheetApp.getActiveSpreadsheet();
  
  var self = this;
  
  self.values = {};
  
  self.values.file = file;
    
  // set sheet with settings
  var sheetIni = getSettingsSheet(C_USER_SETTINGS_SHEET, C_USER_SETTINGS_KEYS, C_USER_SETTINGS_HIDDEN, C_USER_SETTINGS_NOTES);
    
  // read settings
  var data = sheetIni.getDataRange().getValues();
  
  // get sample data
  if (data.length == 1) { data = getSampleSheetsIni(C_SAMPLE_WORK_SHEET, C_SAMPLE_DATA_SHEET, sheetIni); }
  

  // get data
  var namesWork = [];
  var namesData = [];
  var idsSource = [];
  var rowsHeader = [];
  var columns = [];
  
  var row = [];
  for (var i = 1, l = data.length; i < l; i++)
  {
    row = data[i];
    namesWork.push(row[0]);
    namesData.push(row[1]);
    idsSource.push(row[2]);
    rowsHeader.push(row[3]);
    columns.push(row[4]);      
  }
  
  self.values.namesWork = namesWork;
  self.values.namesData = namesData;
  self.values.idsSource = idsSource === '' ? false : idsSource;
  self.values.rowsHeader = rowsHeader === '' ? false : rowsHeader;
  self.values.columns = columns === '' ? false : columns;
  
  // split columns lists by comma
  for (var i = 0, l = columns.length; i < l; i++)
  {
    if (columns) { columns[i] = columns[i].split(C_NUMBER_DELIMETER); }
  }
  
  return self.values;

}





/*
  Returns sample data to show how DDV works
  It makes sure, Sapmle sheets are in, creates them,
  makes sample settings.

*/
function test_getSettingsSheet()
{
  Logger.log(getSettingsSheet(C_USER_SETTINGS_SHEET, C_USER_SETTINGS_KEYS, C_USER_SETTINGS_HIDDEN, C_USER_SETTINGS_NOTES));
}
function getSampleSheetsIni(nameWork, nameData, sheetIni)
{
  // get sample sheets
  var sheetData = getSampleDataSheet(nameData);
  var sheetWork = getSampleWorkSheet(nameWork);
  
  // var C_USER_SETTINGS_KEYS = ['Work Sheet', 'Data Sheet', 'Source File Id', 'Header Row', 'Columns']; // headers for sheet with settings
  sheetIni.getRange(2, 1).setValue(nameWork);
  sheetIni.getRange(2, 2).setValue(nameData);
  sheetIni.getRange(2, 3).setValue(sheetIni.getParent().getId()); // get Id of this spreadsheet
  
  // get Sample connection
  var connection = getConnection(nameWork, sheetData.getDataRange().getValues()[0]); // {"r":5,"c":[1,2,3,5]}
  sheetIni.getRange(2, 4).setValue(connection.r);
  sheetIni.getRange(2, 5).setValue(connection.c.join(','));
  
  // return settings data
  var data = sheetIni.getDataRange().getValues();  
  return data;
  
}


/*
  getSettingsSheet
  
  Settings sheet is where all DV connections are set
  This function creates this sheet if not exists.

  returns sheet


*/
// var C_USER_SETTINGS_SHEET = '_iniDv_'; // name of sheet with settings
// var C_USER_SETTINGS_KEYS = ['Work Sheet', 'Data Sheet', 'Source File Id', 'Header Row', 'Columns']; // headers for sheet with settings
// var C_USER_SETTINGS_HIDDEN = [        0,             0,                1,            1,         1]; // hide columns with settings by default
// C_USER_SETTINGS_NOTES...
function getSettingsSheet(name, listFields, listHidden, notes)
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName(name);
  if (sheet != null) { return sheet; }
  
  // create new sheet
  file.insertSheet(name);
  sheet = file.getSheetByName(name);
  
  // hide columns
  for (var i = 0, l = listHidden.length; i < l; i++)
  {
    if (listHidden[i] == 1) sheet.hideColumns(i + 1);  
  } 
  
  // delete all columns except headers + 1
  var columnPosition = l + 1;
  var howMany = sheet.getMaxColumns() - l - 1;
  sheet.deleteColumns(columnPosition, howMany);
  
  // make headers
  sheet.appendRow(listFields);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, l).setFontWeight("bold").setNotes([notes]);
    
    
  // leave 30 rows
  howMany = sheet.getMaxRows() - 30;
  var rowPosition = 31;
  sheet.deleteRows(rowPosition, howMany);
  
  return sheet;
  
}


function test_getSampleWorkSheet()
{
  Logger.log(getSampleWorkSheet(C_SAMPLE_WORK_SHEET));
}

/*
  creates sample datasheet in current workbook
  it is useful if you've made some errors to reset 
  your data sheet. Delete current sheet and run the script.
  
  will return sheet
  

*/
// var C_SAMPLE_DATA_SHEET = 'Data Sample'; // sample worksheet containing data
// var C_SAMPLE_WORK_SHEET = 'Work Sample'; // sample worksheet to work on, for DV tests
function getSampleDataSheet(name)
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName(name);
  if (sheet != null) { return sheet; }  
  
  // create new sheet
  file.insertSheet(name);
  sheet = file.getSheetByName(name);
  
  var data = 
  [
    ['Planet', 'Mainland', 'Country', 'City'],
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
    ['Earth', 'America', 'USA', 'San Francisco'],
    ['Earth', 'America', 'USA', 'Chicago'],
    ['Tatooine', 'Yulab', 'Putesh', 'ASU'],
    ['Tatooine', 'Yulab', 'Putesh', 'Niatirb'],
    ['Tatooine', 'Yulab', 'Zalip', 'Duantan'],
    ['Tatooine', 'Asia', 'Solo', 'Lion'],
    ['Tatooine', 'Asia', 'Solo', 'To']      
  ];
  
  // set data
  var l = data[0].length;
  var h = data.length;
  var range = sheet.getRange(1, 1, h, l);
  range.setValues(data);
  
  // format headers
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, l).setFontWeight("bold");
  
  // delete all columns except headers + 1
  var columnPosition = l + 1;
  var howMany = sheet.getMaxColumns() - l - 1;
  sheet.deleteColumns(columnPosition, howMany);  
  
  // leave l + 30 rows
  howMany = sheet.getMaxRows() - h - 30;
  var rowPosition = h + 31;
  sheet.deleteRows(rowPosition, howMany); 
  
  return sheet;

}



/*
  creates sample worksheet in current workbook
  it is useful if you've made some errors to reset 
  your work sheet. Delete current sheet and run the script.
  
  will return sheet

*/
// var C_SAMPLE_DATA_SHEET = 'Data Sample'; // sample worksheet containing data
// var C_SAMPLE_WORK_SHEET = 'Work Sample'; // sample worksheet to work on, for DV tests
function getSampleWorkSheet(name)
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName(name);
  if (sheet != null) { return sheet; }  
  
  // create new sheet
  file.insertSheet(name);
  sheet = file.getSheetByName(name);
  
  var data = 
  [
    ['Dependent Drop-Down Lists', '', '', '', ''],
    ['Please try entering the following:', '', '', '', ''],
    ['Planet → Mainland → Country → City', '', '', '', ''],
    ['', '', '', '', ''],
    ['Planet', 'Mainland', 'Country', 'Code', 'City']     
  ];
  
  // set data
  var l = data[0].length;
  var h = data.length;
  var range = sheet.getRange(1, 1, h, l);
  range.setValues(data);
  
  // format headers
  sheet.setFrozenRows(5);
  sheet.getRange(5, 1, 1, l).setFontWeight("bold");
  sheet.getRange(1, 1).setFontSize(14).setFontWeight("bold");
   
  
  // leave l + 300 rows
  howMany = sheet.getMaxRows() - h - 300;
  var rowPosition = h + 301;
  sheet.deleteRows(rowPosition, howMany); 
  
  return sheet;

}