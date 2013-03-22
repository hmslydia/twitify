module.exports = {
  filterArray: function(arr, fun ){
    if (arr == null)
      throw new TypeError();
 
    var t = Object(arr);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  },
  filterDictionary: function(dict, fun ){
    if (dict == null)
      throw new TypeError();
 
    var t = Object(dict);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = {};
    for (var i in dict)
    {
        var thisp = arguments[1];
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res[i] = val;
      
    }
 
    return res;
  },
  dictToArray: function(dict){
    if (dict == null)
      throw new TypeError();
  
    var res = [];
    for (var i in dict)
    {
        res.push(dict[i]);
    }
 
    return res;
  },
};


/*
var filter = function(arr, fun ){
    if (arr == null)
      throw new TypeError();
 
    var t = Object(arr);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  };
*/