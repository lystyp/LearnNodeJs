var fs = require("fs");
var mStr;

function getContent(obj, layer){
    if (obj == null) {
      return "\"null\"";
    } else if (obj == undefined) {
      return "\"undefined\"";
    }
    if (
      typeof(obj) == "string"
      || typeof(obj) == "boolean"
      || typeof(obj) == "number"
    ) {
      return "\"" + obj + "\"";
    }
    var arr = Object.keys(obj);
    // console.log(count++);
    // console.log( arr + " \n>>> " + arr.length + ", " + typeof(arr))
    
    if (arr.length > 0 && layer > 0) {
      var j = "{";
      for(var i = 0; i < arr.length;i++){
        var val = arr[i];
        j = j + val + ":" + getContent(obj[val], layer -1);
        if (i < arr.length-1 ) {
          j = j + ",";
        }
      };
      j = j + "}";
      return j;
    } else {
      return "\"" + typeof(obj) + "\"";
    }
}
function content(o ,i){
  mStr = getContent(o, i);
  console.log(mStr)
  return {
    getContentStr:mStr,
    writeToFile:function(name){
      fs.writeFile(name, mStr);
    }
  }

}

module.exports = content;

