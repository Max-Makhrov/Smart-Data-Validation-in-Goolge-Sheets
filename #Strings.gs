/**
 * Splits string into equal parts.
 *
 * @param {string} str The string to chunk.
 * @param {number} length The length of parts.
 * @return Array - string splitted into parts with len = length.
 * @customfunction
 */
function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
function TESTchunkString() {
var str = '12312312';
Logger.log(chunkString(str, 2));

}

function chunkStringParts(str, parts) {
  var len = str.length;
  // length of a part
  var length = Math.ceil(len / parts);
  return chunkString(str, length);
}
function TESTchunkStringParts() {
var str = '12312312';
Logger.log(chunkStringParts(str, 3));

}


function byteCount(str) {
    return encodeURI(str).split(/%..|./).length - 1;
}

/*
  works like function REGEXREPLACE
*/  
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}