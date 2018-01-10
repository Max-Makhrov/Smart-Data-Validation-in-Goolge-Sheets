function test_dvOnEdit()
{
  var file = SpreadsheetApp.getActive();    
  var range = file.getActiveCell(); 
  testOnEditTwice_(range);
}

function test_dvOnEdit_Script()
{
  var file = SpreadsheetApp.getActive();    
  var range = file.getSheetByName(C_SAMPLE_WORK_SHEET).getRange('A6');
  testOnEditTwice_(range);
}

function testOnEditTwice_(range)
{
    // test with single cell  
    dvOnEdit(getEditObject(range));      
    // test with range
    dvOnEdit(getEditObject(range.offset(0, 0, 3, 5))); 
}


function dvOnEdit(e)
{

  var ObjEdit = new ObjectOnEdit(e); 
  /*
  ObjEdit =
    {
      "range":{},
      "numCols":5,
      "numRows":3,
      "numRow":6,
      "numCol":1,
      "boolCell":false,
      "columns":[1,2,3,4,5],
      "getLastRow":8,
      "getLastCol":5,
      "oldValue":"",
      "sheet":{},
      "file":{},
      "idFile":"16hL0Ip9rN8SFHkinBbN-1xUSfUQu5aKvdA2rEgOWSFM",
      "nameSheet":"Work Sample",
      "idSheet":1841614889}
  
  */
  var ObjDv = getDvObject(ObjEdit);  

  /* ObjDv = 
      {"connections":[{"r":5,"c":[1,2,3,5],"columnsChanged":[5,3,2],"name":"0Data Sample"}],
      "dataSets":{"0Data Sample":{"n":"Data Sample","d":{"Earth":{"Europe":{"Britain":...}},"h":["Planet","Mainland","Country","City"],"l":4,"s":">","f":0}}} 
  */
  if (ObjDv === null) { return -1; } // not trigger
  
  /* ObjValues =   
      {"rowNums":[6],"R6C2":{"value":"s","range":{}}} 
  */  
  var ObjValues = getRangeMapR1C1(ObjEdit.range, ObjEdit.getValues());

  
  makeSmartDataValidation(ObjDv, ObjValues, ObjEdit.sheet);

}


