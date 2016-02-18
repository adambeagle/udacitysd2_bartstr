/*
  util.js

  Helper functions useful cross-project that don't belong anywhere else.
*/

/* 
  Given an object of parameter names and values, 
  construct a string for use in a URL.

  EXAMPLE:
    In: {
          name1: 'value1',
          novalue: null,
          name2: 'value2'
    }
    
    Out: '?name1=value1&novalue&name2=value2'
*/
function toUrlParams(obj) {
  var s = '';
  
  for (var key in obj) {
    var val = obj[key];
    
    if (val !== null)
      s += '&' + key + '=' + val;
    else
      s += '&' + key;
  }
  
  s = '?' + s.slice(1);
  return s;
}

module.exports = {
  toUrlParams: toUrlParams
};