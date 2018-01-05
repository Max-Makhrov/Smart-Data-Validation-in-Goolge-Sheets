function makeSmartDataValidation(ObjDv, ObjValues, sheet)
{
  // Loop connections
  var connections = ObjDv.connections;
  var connection = {};
  var dataSet = {};
  
  for (var i = 0, l = connections.length; i < l; i++)
  {
    connection = connections[i];
    dataSet = ObjDv.dataSets[connection.name];
    makeSmartDVConnection(ObjValues, connection, dataSet);  
  }
  
  // take action at last  
  makeTasks(sheet);
}

function makeSmartDVConnection(ObjValues, connection, dataSet)
{
  /*
    connection   =   {"r":5,"c":[1,2,3,5],"columnsChanged":[2,3,5],"name":"0Data Sample"}
    ObjValues    =   {"rowNums":[6],"R6C2":{"value":"s","range":{}}} 
    dataSet      =   {"n":"Data Sample","d":{"Earth":{"Europe":{"Britain":...}},"h":["Planet","Mainland","Country","City"],"l":4,"s":">","f":0}}  
  */
  
  var columnsChanged = connection.columnsChanged;
  var numCol = columnsChanged[columnsChanged.length - 1]; // check only last changed column
  
  var numRows = ObjValues.rowNums;
  var objDvChange = {};
  var objCellInfo = {};
  var numRow = 0;

  // loop changed rows
  for (var i = 0, l = numRows.length; i < l; i++)
  {
    numRow = numRows[i];
    if (numRow > connection.r) // check if row is in range of data
    {
      objDvChange = getObjDvChange(numCol, numRows[i], connection.c, columnsChanged, ObjValues);
      makeSmartDVRow(objDvChange, dataSet, ObjValues);  
    }
  }

}

function getObjDvChange(numCol, numRow, columns, columnsChanged, ObjValues)
{
  var objDvChange = {};
  
  // fill with coords
  objDvChange.numRow = numRow;
  objDvChange.numCol = numCol;
  objDvChange.addR1C1 = 'R' + numRow + 'C' + numCol;
  objDvChange.columns = columns;
  objDvChange.columnsChanged = columnsChanged;
  
  // fill with values
  var objCellInfo = ObjValues[objDvChange.addR1C1];  
  objDvChange.value = objCellInfo.value;
  objDvChange.range = objCellInfo.range;
  
  return objDvChange; 
}


function makeSmartDVRow(objDvChange, dataSet, ObjValues)
{
  /*
    objDvChange   =   {"numRow":7,"addR1C1":"R7C1","value":"Tatooine","range":{},"numCol":3, "columns": [1,2,3,5],"columnsChanged":[2,3,5]}
    ObjValues    =   {"rowNums":[6],"R6C2":{"value":"s","range":{}}} 
    dataSet      =   {"n":"Data Sample","d":{"Earth":{"Europe":{"Britain":...}},"h":["Planet","Mainland","Country","City"],"l":4,"s":">","f":0}}  
  */
  
  
  // Check if column is last level
  var boolLastLevel = false;
  var level = objDvChange.columns.indexOf(objDvChange.numCol);
  boolLastLevel = (level === dataSet.l - 1);
  
  // Check. If empty ctring
  var boolBadValue = false;
  if (objDvChange.value === '') { boolBadValue = true; }  // value = '' 

  // get a helpText
  var ObjValue = ObjValues[objDvChange.addR1C1]
  var range = ObjValue.range;
  var validation = range.getDataValidation();
    
  // Check. if no data validation
  if (!validation) { boolBadValue = true; }               // no data validation  
  else
  {
    // get next help text: "Earht>Europe", "Earth"  
    var helpText = validation.getHelpText();
    var keyData = helpText + dataSet.s + objDvChange.value;     
  }

  if (!helpText) { keyData = ObjValue.value; }
      
  // get next list for DVR
  var keyTask = 'makeDv';
  var data = getDvRuleList(dataSet, keyData); 
  // Check. if no data found
  if (!data) { boolBadValue = true; }                     // no data dound
  
  // deal with bad value 
  if (boolBadValue)
  {  
    dealWithBadValue(objDvChange, ObjValues, dataSet);
    return 0; // do not add tasks 
  }
  if (boolLastLevel) { return 0; } // last level & value = OK
  
  // Add task
  var columns = objDvChange.columns;
  var numIndx = columns.indexOf(objDvChange.numCol) + 1;
  if (numIndx === dataSet.l) { return 0; } // no need to make new rule, this is last level
  var numColTo = columns[numIndx];  
   
  addTask(keyTask, keyData, objDvChange.numRow, [numColTo], data); 
  
  // fill the only value
  if (data.length === 1) { dealWithOnlyValue(data[0], keyData, dataSet.s, objDvChange.numRow, numColTo, columns, dataSet) }


}


function dealWithOnlyValue(value, keyData, splitter, numRow, numColTo, columns, dataSet)
{
  // if last level
  var boolLastLevel = false;
  var level = columns.indexOf(numColTo);
  boolLastLevel = (level === dataSet.l - 1);
  
  // set the only value
  var keyTask = 'setVal'
  addTask(keyTask, value, numRow, [numColTo]);

  // make next validation if it is not the last value
  if (!boolLastLevel)
  {
    
    // add task on next DV
    keyTask = 'makeDv';
    keyData = keyData + splitter + value; // A>B + > + C = A>B>C
    var data = getDvRuleList(dataSet, keyData);    
    numColTo = columns[level + 1]; // column of the next level
    addTask(keyTask, keyData, numRow, [numColTo], data);
    
    // launch itself
    if (data.length === 1) {
      value = data[0]
      dealWithOnlyValue(value, keyData, splitter, numRow, numColTo, columns, dataSet);
    }
    
  }
}


function dealWithBadValue(objDvChange, ObjValues, dataSet)
{

  /*
    objDvChange   =   {"numRow":7,"addR1C1":"R7C1","value":"Tatooine","range":{},"numCol":3, "columns": [1,2,3,5],"columnsChanged":[2,3,5]}
    ObjValues    =   {"rowNums":[6],"R6C2":{"value":"s","range":{}}} 
    dataSet      =   {"n":"Data Sample","d":{"Earth":{"Europe":{"Britain":...}},"h":["Planet","Mainland","Country","City"],"l":4,"s":">","f":0}}  
  */
  
  /*
  Plan:
    a. add to tasks: kill validation and values on next levels, on head level if it is
    b. run makeSmartDVRow with level - 1 (check if it is ok) or If level = 1 => exit  
  */
  
  
  /*
    OBJ_TASKS_DV
     "clearContents"   ~   keyTask
        ""   ~   keyData
          numRows = [1,2,3,4]
          numColumnss = [[2,3], [2,3], [2,3], [2,3]]
     "makeDv"
         "Paris>Lion"
            numRows = [1,2,3,4]
            numColumnss = [[2,3], [2,3], [2,3], [2,3]]         
            data = ["Paris", "Lion"]
        
     addTask(keyTask, keyData, numRow, numCols, data)     
  */
  
  
  
  // a. add to tasks: kill validation and values on next levels, on head level if it is  
  var nextColumns =  objDvChange.columns.filter(function(elt) { return elt > objDvChange.numCol; } );
  if (nextColumns && nextColumns.length) { addTask('clearDv', '', objDvChange.numRow, nextColumns); } // clear DV on next levels
  var nextColumnsIn =  objDvChange.columns.filter(function(elt) { return elt >= objDvChange.numCol; } );
  if (nextColumnsIn && nextColumnsIn.length) { addTask('clearContents', '', objDvChange.numRow, nextColumnsIn); } // clear values on next + current level
  
  var indxLevel = objDvChange.columns.indexOf(objDvChange.numCol);
  var indxChanged = objDvChange.columnsChanged.indexOf(objDvChange.numCol);  
  
  if (indxLevel === 0)
  {
    // have a bad value on first level 
    // set data validation
    var keyTask = 'makeDv';
    var keyData = "";
    var data = getDvRuleList(dataSet, "");
    addTask(keyTask, keyData, objDvChange.numRow, [objDvChange.numCol], data);  
    
    return 0; // do nothing more here
  } 
  else if (indxChanged === 0) // nothing before was changed
  {
    return 0; // do nothing more here
  }
  else  
  {  
    // b. run makeSmartDVRow with level - 1 (check if it is ok) or If level = 1 => exit 
    
    // change objDvChange   =   
    // {"numRow":7,"addR1C1":"R7C1","value":"Tatooine","range":{},"numCol":3, "columns": [1,2,3,5],"columnsChanged":[2,3,5]}
    //           +            change         change     change        change              + 
    
    var numColumnPre = objDvChange.columnsChanged[indxChanged - 1];
       
    var newObjDvChange = getObjDvChange(numColumnPre, objDvChange.numRow, objDvChange.columns, objDvChange.columnsChanged, ObjValues); 
    makeSmartDVRow(newObjDvChange, dataSet, ObjValues);
  }

}



