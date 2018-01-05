/*
  This file only work with functions from file:
    https://github.com/Max-Makhrov/GoogleSheets/blob/master/Strings.js
  
  function setPropertyFromNamedRange:
    input:
      * strRange -- name of range. Range must contain text like this:
        ["Name", 600, "One;Two;Three", ...]
*/



var NUM_MAX_BITE_SIZEOFPROPERTY = 9000;
var NUM_MAX_BITE_SIZEOFPROPERTIES = 25000;
/* https://developers.google.com/apps-script/guides/services/quotas */

var STR_PREFIX_NUMOFPARTS = 'NUM_OF_PARTS'


/* setData
  sets data to properties, get it from named range from workbook SS
  
  * SS            spreadsheet to look at, default = thisWorkbook
  
  * strRange      name of range,  //! must be single cell range !//
  
  * key           name of variable, in which ve whete data, default = strRange
   
*/
function setPropertyFromNamedRange(SS, strRange, key) {
  key = key || strRange;
  SS = SS || SpreadsheetApp.getActiveSpreadsheet();
  var range = SS.getRangeByName(strRange);
  var value = range.getValue();
  return setUserProperty(value, key);
}


function setUserProperty(value, key) {
  var userProperties = PropertiesService.getUserProperties();  
 
  // see restrictions
  var numBites = byteCount(value);
  
  if (numBites > NUM_MAX_BITE_SIZEOFPROPERTIES) {   
    return 'Set Properties -- error. String size is more than ' + NUM_MAX_BITE_SIZEOFPROPERTIES + ' bites.' 
  }
  // split string into parts
  var numParts = Math.ceil(numBites / NUM_MAX_BITE_SIZEOFPROPERTY);
  var values = chunkStringParts(value, numParts);
     
  // set number of parts of data
  userProperties.setProperty(key + STR_PREFIX_NUMOFPARTS, numParts);
  
  // set data
  for (var i = 0; i < numParts; i++) {
    value = values[i];
    userProperties.setProperty(key + i, value);  
  }

  return 'Set Properties -- ok!'
}

function getUserProperty(key) {
  var userProperties = PropertiesService.getUserProperties();
  var property = ''
  var numParts = userProperties.getProperty(key + STR_PREFIX_NUMOFPARTS);
  
  for (var i = 0; i < numParts; i++) {
      property += userProperties.getProperty(key + i);  
  }  
  
  return property;

}

/*
  read property as JSON file

*/
function getPropertyAsArray(key) {
  var userProperties = PropertiesService.getUserProperties();
  var property = ''
  var numParts = userProperties.getProperty(key + STR_PREFIX_NUMOFPARTS);
  
  for (var i = 0; i < numParts; i++) {
      property += userProperties.getProperty(key + i);  
  }
  //Logger.log(property);
  
  var data = JSON.parse(property);  
  
  return data;

}