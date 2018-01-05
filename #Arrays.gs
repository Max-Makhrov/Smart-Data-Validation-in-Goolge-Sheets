// https://stackoverflow.com/a/1887494/5372400
function test_intersection()
{
Logger.log(arrayIntersection( [1, 2, 3, "a"], [1, "a", 2], ["a", 1] )); // Gives [1, "a"]; 

}

var arrayContains = Array.prototype.indexOf ?
    function(arr, val) {
        return arr.indexOf(val) > -1;
    } :
    function(arr, val) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    };
function arrayIntersection() {
    var val, arrayCount, firstArray, i, j, intersection = [], missing;
    var arrays = Array.prototype.slice.call(arguments); // Convert arguments into a real array

    // Search for common values
    firstArray = arrays.pop();
    if (firstArray) {
        j = firstArray.length;
        arrayCount = arrays.length;
        while (j--) {
            val = firstArray[j];
            missing = false;

            // Check val is present in each remaining array 
            i = arrayCount;
            while (!missing && i--) {
                if ( !arrayContains(arrays[i], val) ) {
                    missing = true;
                }
            }
            if (!missing) {
                intersection.push(val);
            }
        }
    }
    return intersection;
}


function test_getFilled2DArray()
{
  var value = 'max';
  Logger.log(getFilled2DArray(value, 3, 4));
  // [[max, max, max], [max, max, max], [max, max, max], [max, max, max]]
}
function getFilled2DArray(value, w, h)
{
  var result = [];
  var row = [];
  for (var i = 0; i < h; i++)
  {
    row = [];
    for (var ii = 0; ii < w; ii++) { row.push(value); }
    result.push(row);
  }
  return result;

}