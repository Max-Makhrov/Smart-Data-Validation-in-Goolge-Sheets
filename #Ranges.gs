function test_getRangeValuesMapR1C1()
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getActiveSheet();
  var range = sheet.getRange('B2:C12');
  Logger.log(getRangeMapR1C1(range));
}
/*
 {rowNums=[2, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0], 
  R2C2={range=Range, value=Data Sample}, 
  R8C3={range=Range, value=}, 
  R9C2={range=Range, value=}, 
  R9C3={range=Range, value=}... 
  }}
*/
function getRangeMapR1C1(range, values) {
  values = values || range.getValues();
  
  var colStart = range.getColumn();
  var rowStart = range.getRow();
    
  var cols = range.getWidth() + colStart - 1;
  var rows = range.getHeight() + rowStart - 1;
  
  var obj = {};
  
  obj.rowNums = [];
  var cell = {};
  
  for (var row = rowStart; row <= rows; row++)
  {
    obj.rowNums.push(row);
    for (var col = colStart; col <= cols; col++) 
    { 
      cell = {};
      cell.value = values[row - rowStart][col - colStart]; 
      cell.range = range.offset(row - rowStart, col - colStart, 1, 1); // .getA1Notation()
      obj['R' + row + 'C' + col] = cell; 
    }  
  }
  
  return obj;
   
}
